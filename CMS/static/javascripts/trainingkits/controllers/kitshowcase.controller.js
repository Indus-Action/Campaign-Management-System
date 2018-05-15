(function() {
  'use strict';

  angular
    .module('vms2.trainingkits.controllers')
    .controller('KitShowcaseController', KitShowcaseController);

  KitShowcaseController.inject = ['$mdDialog', '$mdMedia', '$routeParams', '$scope', 'TrainingKit'];

  function KitShowcaseController($mdDialog, $mdMedia, $routeParams, $scope, TrainingKit) {
    var vm = this;
    vm.loading = false;
    vm.toggleview = true;

    vm.kit_id = $routeParams.id;
    vm.kit = {};
    vm.anticache_number = Math.floor(Math.random() * 100);

    vm.getPageList = getPageList;
    vm.openPageView = openPageView;
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

        console.log("Kit data retrieved.");
      }
      function getKitPagesFailure() {
        vm.loading = false;
        console.log("Kit data retrieval failed.");
      }
    }

    function openPageView(page_id) {
      function pageViewDialog(ev) {
        var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

        $mdDialog.show({
          controller: 'PageViewDialogController',
          controllerAs: 'vm',
          templateUrl: '/static/templates/trainingkits/pageviewdialog.html',
          locals: {PageID: page_id},
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: use_full_screen
        }).then(function(page_data) {
          console.log("Dialog for page view " + page_data.id + " closed. (Todo: Insert angular material toast.)");
          vm.getPageList();
        }, function() {
          console.log("Page view dialog canceled.");
          vm.getPageList();
        });

        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });
      }
      pageViewDialog();
    }

    function getVideoType(url) {
      return "video/" + url.slice((url.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    function antiCacheUrl(url) {
      return url + "?anticache=" + vm.anticache_number;
    }
  }
})();
