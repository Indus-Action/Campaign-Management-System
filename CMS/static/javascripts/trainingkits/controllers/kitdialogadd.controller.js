(function() {
  'use strict';

  angular
    .module('vms2.trainingkits.controllers')
    .controller('KitDialogAddController', KitDialogAddController);

  KitDialogAddController.inject = ['TrainingKit', '$mdMedia', '$mdDialog'];

  function KitDialogAddController(TrainingKit, $mdMedia, $mdDialog) {
    var vm = this;
    vm.kit = {};
    vm.loading = false;

    vm.saveKit = function() {
      vm.loading = true;

      TrainingKit.create(
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
  }
})();