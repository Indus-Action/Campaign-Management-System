(function () {
  'use strict';

  angular
    .module('vms2.notices.controllers')
    .controller('NoticeController', NoticeController);

  NoticeController.$inject = ['$scope', '$mdMedia', '$mdDialog', 'Auth', 'Notices'];

  function NoticeController($scope, $mdMedia, $mdDialog, Auth, Notices) {
    var vm = this,
        notice = $scope.notice;

    vm.creator = null;

    vm.openEditNoticePopup = openEditNoticePopup;
    vm.is_authenticated = Auth.isAuthenticated();
    vm.is_admin = Auth.isAdmin();

    if (notice) {
      if (notice.creator) {
        Auth.get(notice.creator)
          .then(noticeCreatorGetSuccessFn, noticeCreatorGetErrorFn);
      }
    }

    function noticeCreatorGetSuccessFn(response) {
      vm.creator = response.data;
    }

    function noticeCreatorGetErrorFn(response) {
      console.log('Error while getting notice creator in NoticeController');
    }

    function openEditNoticePopup(notice, ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {data: notice},
        controller: 'EditNoticeController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/notices/edit-notice.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(data) {
        Notices.all()
          .then(noticesAllSuccessFn, noticesAllErrorFn);
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function noticesAllSuccessFn(response) {
      $scope.parent.notices = response.data;
    }

    function noticesAllErrorFn(response) {
      console.log('Error while getting notices');
    }
  }
})();
