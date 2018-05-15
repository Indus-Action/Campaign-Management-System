(function () {
  'use strict';

  angular
    .module('vms2.space_types.controllers')
    .controller('SpaceTypeController', SpaceTypeController);

  SpaceTypeController.$inject = ['$scope', '$mdMedia', '$mdDialog', '$q', 'Auth', 'Locations', 'SpaceTypes'];

  function SpaceTypeController($scope, $mdMedia, $mdDialog, $q, Auth, Locations, SpaceTypes) {
    var vm = this,
        space_type = $scope.spaceType;

    vm.data = {};

    vm.addSpaces = addSpaces;
    vm.openEditSpaceTypePopup = openEditSpaceTypePopup;

    function processSpaces(spaces) {
      var promises = [],
          promise_spaces = [];

      vm.data.spaces = spaces.data;
      vm.data.space_type = space_type.id;

      for (var s in vm.data.spaces) {
        if (vm.data.spaces[s].address) {
          promises.push(Locations.getLatLngFromGoogle(vm.data.spaces[s].address));
        } else {
          vm.data.spaces.splice(s, 1);
        }
      }

      $q.all(promises).then(allLatLngGetSuccessFn);

      function allLatLngGetSuccessFn(responses) {
        for (var i in vm.data.spaces) {
          vm.data.spaces[i].lat = responses[i].data.results[0].geometry.location.lat;
          vm.data.spaces[i].lng = responses[i].data.results[0].geometry.location.lng;
        }

        SpaceTypes.addSpaces(vm.data)
          .then(spacesAddSuccessFn, spacesAddErrorFn);

        function spacesAddSuccessFn(resposne) {
          console.log('Yes!');
        }

        function spacesAddErrorFn(resposes) {
          console.log('No');
        }
      }
    }

    function addSpaces() {
      var fileInput = document.getElementById('fileInput'),
          file = fileInput.files[0],
          textType = /text.*/;

      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: processSpaces
      });
    }

    function openEditSpaceTypePopup(space_type, ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {data: space_type},
        controller: 'EditSpaceTypeController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/space_types/edit-space-type.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(data) {
        SpaceTypes.all()
          .then(spaceTypesAllSuccessFn, spaceTypesAllErrorFn);
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function spaceTypesAllSuccessFn(response) {
      $scope.parent.space_types = data.data;
    }

    function spaceTypesAllErrorFn(response) {
      console.log('Error while getting space types');
    }
  }
})();
