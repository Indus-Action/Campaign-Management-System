(function() {
  'use strict';

  angular
    .module('vms2.trainingkits.controllers')
    .controller('KitDialogEditController', KitDialogEditController);

  KitDialogEditController.inject = ['TrainingKit', 'KitID', '$mdMedia', '$mdDialog'];

  function KitDialogEditController(TrainingKit, KitID, $mdMedia, $mdDialog) {
    var vm = this;
    vm.kit = {};
    vm.kit.id = KitID;
    vm.loading = false;

    vm.getKitData = function() {
      vm.loading = true;

      TrainingKit.get(
        vm.kit.id
      ).then(getKitSuccess, getKitFailure);

      function getKitSuccess(response) {
        vm.loading = false;
        vm.kit = response.data;
        console.log("Kit retrieved.");
      }
      function getKitFailure() {
        vm.loading = false;
        console.log("Kit retrieval failed.");
      }
    };

    vm.saveKit = function() {
      vm.loading = true;

      TrainingKit.save(
        vm.kit
      ).then(kitSaveSuccess, kitSaveFailure);

      function kitSaveSuccess() {
        vm.loading = false;
        console.log("Kit info saved.");
        vm.hide(vm.kit)
      }
      function kitSaveFailure() {
        vm.loading = false;
        console.log("Kit info attempt to save failed.");
      }
    };

    vm.cancel = function(data) {
      $mdDialog.cancel(data);
    };

    vm.hide = function(data) {
      $mdDialog.hide(data);
    };

    vm.getKitData();
  }
})();
