(function() {
  'use strict';

  angular
    .module('vms2.trainingkits.controllers')
    .controller('PageListController', PageListController);

  PageListController.inject = ['TrainingKit', '$routeParams', '$mdMedia', '$mdDialog', '$scope', '$location', 'Auth'];

  function PageListController(TrainingKit, $routeParams, $mdMedia, $mdDialog, $scope, $location, Auth) {
    var vm = this;
    vm.loading = false;

    vm.kit_id = $routeParams.id;

    vm.kit = {};
    vm.pagetypes = {};
    vm.is_admin = Auth.isAdmin();

    vm.getPageList = function() {
      vm.loading = true;

      TrainingKit.getKitPages(
        vm.kit_id
      ).then(getKitPagesSuccess, getKitPagesFailure);

      function getKitPagesSuccess(response) {
        vm.loading = false;
        vm.kit = response.data;
        console.log("Kit data retrieved.");
      }
      function getKitPagesFailure() {
        vm.loading = false;
        console.log("Kit data retrieval failed.");
      }
    };

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

    vm.deletePage = function(page_id) {
      TrainingKit.deletePage(
        page_id
      ).then(deletePageSuccess, deletePageFailure);

      function deletePageSuccess() {
        vm.getPageList();
        console.log("Psge " + page_id  + " deleted");
      }
      function deletePageFailure() {
        vm.getPageList();
        console.log("Page deletion failed.");
      }
    };

    vm.createPage = function() {
      function pageDialog(ev) {
        var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

        $mdDialog.show({
          controller: 'PageDialogAddController',
          controllerAs: 'vm',
          templateUrl: '/static/templates/trainingkits/pagedialogcreate.html',
          locals: {KitID: vm.kit_id},
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: use_full_screen
        }).then(function(page_data) {
          console.log("Dialog for new page closed.");
          vm.getPageList();
        }, function() {
          console.log("Page dialog canceled.");
          vm.getPageList();
        });

        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });
      }
      pageDialog();
    };

    vm.openPageDialog = function(page_id) {
      function pageDialog(ev) {
        var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

        $mdDialog.show({
          controller: 'PageDialogEditController',
          controllerAs: 'vm',
          templateUrl: '/static/templates/trainingkits/pagedialogedit.html',
          locals: {PageID: page_id},
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: use_full_screen
        }).then(function(page_data) {
          console.log("Dialog for page " + page_data.id + " closed.");
          vm.getPageList();
        }, function() {
          console.log("Page dialog canceled.");
          vm.getPageList();
        });

        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });
      }
      pageDialog();
    };

    vm.openPageEditor = function(page_id) {
      function pageEditorDialog(ev) {
        var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

        $mdDialog.show({
          controller: 'PageContentEditController',
          controllerAs: 'vm',
          templateUrl: '/static/templates/trainingkits/pagedialogeditcontent.html',
          locals: {PageID: page_id},
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:false,
          escapeToClose: false,
          fullscreen: use_full_screen
        }).then(function(page_data) {
          console.log("Dialog for page content " + page_data.id + " closed.");
          vm.getPageList();
        }, function() {
          console.log("Page content dialog canceled.");
          vm.getPageList();
        });

        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });
      }
      pageEditorDialog();
    };

    vm.previewContent = function() {
      $location.path('/training/' + vm.kit_id + '/showcase');
    };

    vm.getPageTypes();
    vm.getPageList();
  }
})();
