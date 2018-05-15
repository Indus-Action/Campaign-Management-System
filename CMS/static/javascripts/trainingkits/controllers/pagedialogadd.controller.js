(function() {
  'use strict';

  angular
    .module('vms2.trainingkits.controllers')
    .controller('PageDialogAddController', PageDialogAddController);

  PageDialogAddController.inject = ['TrainingKit', 'KitID', '$mdMedia', '$mdDialog'];

  function PageDialogAddController(TrainingKit, KitID, $mdMedia, $mdDialog) {
    var vm = this;
    vm.page = {};
    vm.kit_id = KitID;
    vm.loading = false;
    vm.pagetypes = {};

    vm.getPageTypes = function() {
      TrainingKit.getPageTypes().then(getPageTypesSuccess, getPageTypesFailure);

      function getPageTypesSuccess(response) {
        vm.pagetypes = response.data;
        console.log("Page types retrieved.");
      }
      function getPageTypesFailure() {
        console.log("Page types retrieval failed.");
      }
    };

    vm.savePage = function() {
      vm.loading = true;

      TrainingKit.createPage(
        vm.kit_id,
        vm.page
      ).then(pageSaveSuccess, pageSaveFailure);

      function pageSaveSuccess() {
        vm.loading = false;
        console.log("Page info saved.");
        vm.hide(vm.page);
      }
      function pageSaveFailure() {
        vm.loading = false;
        console.log("Page failed to save.");
      }
    };

    vm.cancel = function(data) {
      $mdDialog.cancel(data);
    };

    vm.hide = function(data) {
      $mdDialog.hide(data);
    };

    vm.getPageTypes();
  }
})();
