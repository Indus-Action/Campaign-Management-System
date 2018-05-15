(function() {
  'use strict';

  angular
    .module('vms2.trainingkits.controllers')
    .controller('PageViewDialogController', PageViewDialogController);

  PageViewDialogController.inject = ['$mdDialog', 'PageID', 'TrainingKit'];

  function PageViewDialogController($mdDialog, PageID, TrainingKit) {
    var vm = this;
    vm.page = {};
    vm.page.id = PageID;
    vm.kit_id = -1;
    vm.loading = false;
    vm.parsed_file_list = [];
    vm.anticache_number = Math.floor(Math.random() * 100); 

    vm.getPageData = getPageData;
    vm.getVideoType = getVideoType;
    vm.antiCacheUrl = antiCacheUrl;
    vm.cancel = cancel;
    vm.hide = hide;

    activate();

    function activate() {
      vm.getPageData();
    }

    function getPageData() {
      vm.loading = true;

      TrainingKit.getPage(
        vm.page.id
      ).then(getPageSuccess, getPageFailure);

      function getPageSuccess(response) {
        vm.loading = false;
        vm.page = response.data;
        if(vm.page.content_type != 'TXT') {
          try {
            vm.parsed_file_list = angular.fromJson(vm.page.content);
          } catch (e) {
            // Do nothing.
          }
        }
        vm.kit_id = response.data.kit;
        console.log("Page retrieved.");
      }
      function getPageFailure() {
        vm.loading = false;
        console.log("Page retrieval failed.");
      }
    }

    function getVideoType(url) {
      return "video/" + url.slice((url.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    function antiCacheUrl(url) {
      return url + "?anticache=" + vm.anticache_number;
    }

    function cancel(data) {
      $mdDialog.cancel(data);
    }
    function hide(data) {
      $mdDialog.hide(data);
    }
  }
})();
