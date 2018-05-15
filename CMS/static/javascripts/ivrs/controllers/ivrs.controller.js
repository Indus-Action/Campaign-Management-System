(function () {
  'use strict';

  angular
    .module('vms2.ivrs.controllers')
    .controller('IVRsController', IVRsController);

  IVRsController.$inject = ['$scope', '$mdDialog', '$mdMedia', 'IVRs'];

  function IVRsController($scope, $mdDialog, $mdMedia, IVRs) {
    var vm = this;

    vm.ivrs = [];
    vm.displayed_ivrs = [];

    vm.openNewIVRPopup = openNewIVRPopup;

    activate();

    function activate() {
      $scope.$watchCollection(function () { return $scope.ivrs; }, render);
    }

    function render(current, original) {
      if (current != original) {
        vm.ivrs = [];
        vm.displayed_ivrs = [];

        for (var i = 0; i < current.length; i++) {
          vm.displayed_ivrs.push(current[i]);
          vm.ivrs.push(current[i]);
        }
      }
    }

    function openNewIVRPopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        controller: 'NewIVRController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/ivrs/new-ivr.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(message) {
        vm.ivrs.push(message)
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
