(function() {
  'use strict';

  angular
    .module('vms2.forms.controllers')
    .controller('FormFieldController', FormFieldController);

  FormFieldController.inject = ['$q', '$scope', '$timeout', 'Auth', 'Forms', 'Locations'];

  function FormFieldController($q, $scope, $timeout, Auth, Forms, Locations) {
    var vm = this;
    vm.loading = false;

    vm.addMoreToMultiField = addMoreToMultiField;
    vm.deleteItem = deleteItem;

    activate();

    function render () {
      if (($scope.field.type === 'autocomplete' && $scope.field.multiple) || $scope.field.type === 'user') {
        if ($scope.field.value) {
          vm.dropdown_list = [];
          for (var i in $scope.field.value) {
            var temp = {};
            temp.searchtext = angular.copy($scope.field.value[i]);
            vm.dropdown_list.push(temp);
          }
        }
      } else if (($scope.field.type === 'autocomplete' && !$scope.field.multiple)) {
        if ($scope.field.value) {
          vm.selected_item = $scope.field.value;
        }
      }
    }

    function activate () {
      $scope.$watchCollection(function () { return $scope.field; }, render);

      if ($scope.field.multiple && $scope.field.type !== 'dropdown') {
        if (!$scope.field.value) {
          $scope.field.value = [''];
          $scope.field.default_value = '';
        }
        if (!($scope.field.value instanceof Array)) {
          $scope.field.default_value = $scope.field.value;
          $scope.field.value = [];
          $scope.field.value.push($scope.field.default_value);
        }
        if ($scope.field.type === 'autocomplete' || $scope.field.type === 'user') {
          var val = {};
          val.value = $scope.field.default_value;
          vm.dropdown_list = [];
          vm.dropdown_list.push(val);
          if ($scope.field.value) {
            if ($scope.field.value instanceof Array) {
              vm.dropdown_list = [];
              for (var i in $scope.field.value) {
                var temp = {};
                temp.selected = {};
                for (var j in $scope.field.options) {
                  if ($scope.field.options[j].value === $scope.field.value[i]) {
                    temp.selected = angular.copy($scope.field.options[j]);
                    break;
                  }
                }
                temp.selected = angular.copy($scope.field.value[i]);
                vm.dropdown_list.push(temp);
              }
            }
          }
        } else if ($scope.field.type === 'nestedfield') {
          if(!$scope.field.fields) {
            $scope.field.fields = [];
          }
          if(!($scope.field.fields instanceof Array)) {
            $scope.field.default_value = angular.copy($scope.field.fields);
            $scope.field.fields = [];
            $scope.field.fields.push(angular.copy($scope.field.default_value));
          }
        }
      }
      if ($scope.field.type === 'location') {
        vm.map = {};
        vm.placeresultlist = [];
        vm.selected_place = null;
        vm.selected_place_details = {};

        vm.getPlaces = function(q) {
          vm.loading = true;
          var query = {};
          query.input = q;
          var deferred = $q.defer();

          if (query.input == "") {
            vm.placeresultlist = [];
            vm.loading = false;
            deferred.resolve(vm.placeresultlist);
          } else {
            var callbackSuggestion = function(predictions, status) {
              if (status != google.maps.places.PlacesServiceStatus.OK) {
                console.log("Places autocompletion failed.");
                vm.placeresultlist = [];
              } else {
                vm.placeresultlist = predictions;
              }

              vm.loading = false;
              deferred.resolve(vm.placeresultlist);
            };

            Locations.getPlacesAutocompleteInstance().getPlacePredictions(
              query,
              callbackSuggestion
            );

          }
          return deferred.promise;
        };

        vm.getDetailedPlace = function(place_id) {
          if (place_id) {
            vm.loading = true;
            var request = {};
            request.placeId = place_id;

            var callbackDetails = function(place, status) {
              if(status != google.maps.places.PlacesServiceStatus.OK) {
                console.log("Place retrieval failed.");
              } else {
                console.log("Place successfully retrieved.");
                vm.selected_place_details = place;
                fillPlaceDetails();
              }

              vm.loading = false;
            };

            Locations.getPlacesServiceInstance(vm.map).getDetails(
              request,
              callbackDetails
            );
          }
        };

        function fillPlaceDetails() {
          $scope.field.value.description = vm.selected_place.description;
          $scope.field.value.street_number = "";
          $scope.field.value.route = "";
          $scope.field.value.sublocality_level_3 = "";
          $scope.field.value.sublocality_level_2 = "";
          $scope.field.value.sublocality_level_1 = "";
          $scope.field.value.locality = "";
          $scope.field.value.administrative_area_level_2 = "";
          $scope.field.value.administrative_area_level_1 = "";
          $scope.field.value.country = "";
          $scope.field.value.postal_code = "";
          $scope.field.value.lat = "";
          $scope.field.value.lng = "";

          for (var dat in $scope.field.value) {
            for (var comp in vm.selected_place_details.address_components) {
              var tempsearch = vm.selected_place_details.address_components[comp].types.find(
                function(type) {
                  return type == dat;
                });
              if (tempsearch != undefined) {
                $scope.field.value[dat] = vm.selected_place_details.address_components[comp].long_name;
              }
            }
          }
          $scope.field.value.lat = vm.selected_place_details.geometry.location.lat();
          $scope.field.value.lng = vm.selected_place_details.geometry.location.lng();
        }

        function init() {
          $timeout(function(){
            vm.map = new google.maps.Map(angular.element(document.querySelector("#map_" + $scope.field.title))[0]);
          });
        }

        init();
      } else if ($scope.field.type === 'autocomplete') {
        vm.selected_item = '';

        vm.getOptions = function(searchtext) {
          var results = searchtext ? $scope.field.options.filter(createTextFilterFor(searchtext)) : $scope.field.options;
          return results;
        };

        function createTextFilterFor(text) {
          var query = angular.lowercase(text);
          return function filterFn(option) {
            var lowercase_option = angular.lowercase(option.title);
            return (lowercase_option.indexOf(query) === 0);
          };
        }
      } else if ($scope.field.type === 'user') {
        vm.selected_item = '';

        vm.getOptions = function(searchtext) {
          if (searchtext && searchtext.length > 9) {
            var deferred = $q.defer();
            Auth.getUserByMobile(searchtext)
              .then(beneficiaryGetSuccessFn, beneficiaryGetErrorFn);

            function beneficiaryGetSuccessFn(response) {
              var users = response.data;

              var beneficiaries = users.map(function (user) {
                return {
                  value: user.mobile,
                  display: user.mobile + ' | ' + user.user.first_name + ' ' + user.user.last_name
                };
              });
              deferred.resolve(beneficiaries);
            }

            function beneficiaryGetErrorFn(response) {
              console.log("Error while getting beneficiaries");
              deferred.reject([]);
            }

            return deferred.promise;
          } else {
            return [];
          }
        }
      } else if ($scope.field.type === 'submitbutton') {
        vm.submitFormMidway = function () {
          $scope.$emit('submitrequest');
        };
      }
    }

    function addMoreToMultiField() {
      if ($scope.field.type !== 'nestedfield') {
        $scope.field.value.push(angular.copy($scope.field.default_value));
        if ($scope.field.type === 'autocomplete') {
          var val = {};
          val.value = angular.copy($scope.field.default_value);
          vm.dropdown_list.push(val);
        }
      } else {
        $scope.field.fields.push(angular.copy($scope.field.default_value));
      }
    }

    function deleteItem(array, index, e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      array.splice(index, 1);
    }
  }
})();
