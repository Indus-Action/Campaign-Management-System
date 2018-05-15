(function() {
  'use strict';

  angular
    .module('vms2.trainingkits.controllers')
    .controller('TrainingKitsController', TrainingKitsController);

  TrainingKitsController.inject = ['TrainingKit', '$mdMedia', '$mdDialog', '$scope', '$location', 'Auth'];

  function TrainingKitsController(TrainingKit, $mdMedia, $mdDialog, $scope, $location, Auth) {
    var vm = this;
    vm.loading = false;

    vm.is_admin = Auth.isAdmin();
    vm.kits = [];

    vm.getKitList = function() {
      vm.loading = true;

      TrainingKit.getAll().then(getKitsSuccess, getKitsFailure);

      function getKitsSuccess(response) {
        vm.loading = false;
        vm.kits = response.data;
        console.log("Training kit list retrieved.");
      }
      function getKitsFailure() {
        vm.loading = false;
        console.log("Training kits retrieval failed.");
      }
    };

    vm.deleteKit = function(kit_id){
      vm.loading = true;
      TrainingKit.deleteKit(
        kit_id
      ).then(deleteKitSuccess, deleteKitFailure);

      function deleteKitSuccess() {
        vm.loading = false;
        vm.getKitList();
        console.log("Kit " + kit_id + " deleted.");
      }
      function deleteKitFailure() {
        vm.loading = false;
        console.log("Kit deletion failed.");
      }
    };

    vm.createKit = function() {
      function kitDialog(ev) {
        var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

        $mdDialog.show({
          controller: 'KitDialogAddController',
          controllerAs: 'vm',
          templateUrl: '/static/templates/trainingkits/kitdialogcreate.html',
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: use_full_screen
        }).then(function(kit_data) {
          console.log("Dialog for new kit closed.");
          vm.getKitList();
        }, function() {
          console.log("New kit dialog canceled.");
          vm.getKitList();
        });

        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });
      }
      kitDialog();
    };

    vm.openKitDialog = function(kit_id) {
      function kitDialog(ev) {
        var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

        $mdDialog.show({
          controller: 'KitDialogEditController',
          controllerAs: 'vm',
          templateUrl: '/static/templates/trainingkits/kitdialogedit.html',
          locals: {KitID: kit_id},
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: use_full_screen
        }).then(function(kit_data) {
          console.log("Dialog for kit " + kit_data.id + " closed.");
          vm.getKitList();
        }, function() {
          console.log("Kit dialog canceled.");
          vm.getKitList();
        });

        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });
      }
      kitDialog();
    };

    vm.getPages = function(kit_id) {
      $location.path('/training/' + kit_id + '/pages/');
    };

    vm.getKitList();
  }
})();
