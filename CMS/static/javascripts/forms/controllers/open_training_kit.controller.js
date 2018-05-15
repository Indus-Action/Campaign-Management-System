(function () {
  'use strict';

  angular
    .module('vms2.forms.controllers')
    .controller('OpenTrainingKitController', OpenTrainingKitController);

  OpenTrainingKitController.$inject = ['$mdDialog', 'training_kit', 'TrainingKit'];

  function OpenTrainingKitController($mdDialog, training_kit, TrainingKit) {
    var vm = this;

    vm.kit_id = training_kit;
    vm.kit = {};
    vm.anticache_number = Math.floor(Math.random() * 100);
    vm.in_form_data = true;

    vm.getPageList = getPageList;
    vm.getViedoType = getVideoType;
    vm.antiCacheUrl = antiCacheUrl;

    activate();

    function activate() {
      vm.getPageList();
    }

    function getPageList() {
      vm.loading = true;

      TrainingKit.getKitPages(
        vm.kit_id
      ).then(getKitPagesSuccess, getKitPagesFailure);

      function getKitPagesSuccess(response) {
        vm.loading = false;
        vm.kit = response.data;

        for (var i in vm.kit.pages) {
          if(vm.kit.pages[i].content_type != 'TXT') {
            try {
              vm.kit.pages[i].parsed_file_list = angular.fromJson(vm.kit.pages[i].content);
            } catch (e) {
              // Do nothing.
            }
          }
        }
      }

      function getKitPagesFailure() {
        vm.loading = false;
      }
    }

    function getVideoType(url) {
      return "video/" + url.slice((url.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    function antiCacheUrl(url) {
      return url + "?anticache=" + vm.anticache_number;
    }

  }
})();
