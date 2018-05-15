(function () {
  'use strict';

  angular
    .module('vms2.space_types.controllers')
    .controller('SpaceTypesController', SpaceTypesController);

  SpaceTypesController.$inject = ['$scope', '$mdDialog', '$mdMedia', 'SpaceTypes'];

  function SpaceTypesController($scope, $mdDialog, $mdMedia, SpaceTypes) {
    var vm = this;

    vm.spaceTypes = [];
    vm.displayed_spaceTypes = [];

    vm.openNewSpaceTypePopup = openNewSpaceTypePopup;

    activate();

    function activate() {
      $scope.$watchCollection(function () { return $scope.spaceTypes; }, render);
    }

    function render(current, original) {
      if (current != original) {
        vm.spaceTypes = [];
        vm.displayed_spaceTypes = [];

        for (var i = 0; i < current.length; i++) {
          vm.displayed_spaceTypes.push(current[i]);
          vm.spaceTypes.push(current[i]);
        }
      }
    }

    function openNewSpaceTypePopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        controller: 'NewSpaceTypeController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/space_types/new-space-type.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(space_type) {
        vm.spaceTypes.push(space_type);
      }, function() {
        console.log("this asdasdasd");
      });

      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    }
  }
})();
