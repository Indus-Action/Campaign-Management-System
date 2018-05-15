(function() {
  'use strict';

  angular
    .module('vms2.trainingkits.controllers')
    .controller('PageDialogEditController', PageDialogEditController);

  PageDialogEditController.inject = ['TrainingKit', 'PageID', '$mdMedia', '$mdDialog'];

  function PageDialogEditController(TrainingKit, PageID, $mdMedia, $mdDialog) {
    var vm = this;
    vm.page = {};
    vm.page.id = PageID;
    vm.kit_id = -1;
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

    vm.getPageData = function() {
      vm.loading = true;

      TrainingKit.getPage(
        vm.page.id
      ).then(getPageSuccess, getPageFailure);

      function getPageSuccess(response) {
        vm.loading = false;
        vm.page = response.data;
        vm.kit_id = response.data.kit;
        console.log("Page retrieved.");
      }
      function getPageFailure() {
        vm.loading = false;
        console.log("Page retrieval failed.");
      }
    };

    vm.savePage = function() {
      vm.loading = true;

      TrainingKit.updatePage(
        vm.page.id,
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
    vm.getPageData();
  }
})();
