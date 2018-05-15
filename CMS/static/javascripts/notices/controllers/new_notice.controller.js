(function () {
  'use strict';

  angular
    .module('vms2.notices.controllers')
    .controller('NewNoticeController', NewNoticeController);

  NewNoticeController.$inject = ['Notices', 'Auth', '$routeParams', '$cookies', '$mdDialog'];

  function NewNoticeController(Notices, Auth, $routeParams, $cookies, $mdDialog) {
    var vm = this;

    vm.notice_creation_in_progress = false;
    vm.notice_creation_failed = false;
    vm.notice_creation_failed_messages = [];

    vm.data = {};

    vm.createNewNotice = createNewNotice;
    vm.cancel = cancel;

    function createNewNotice() {
      Auth.getAuthenticatedUser($cookies.get('token'))
        .then(getCurrentUserSuccessFn, getCurrentUserErrorFn);

      vm.notice_creation_in_progress = true;

      function getCurrentUserSuccessFn(response) {
        vm.data.creator = response.data.id;

        Notices.create(vm.data)
          .then(NoticeCreationSuccessFn, NoticeCreationErrorFn);

        function NoticeCreationSuccessFn(response) {
          vm.notice_creation_in_progress = false;
          $mdDialog.hide(response.data);
        }

        function NoticeCreationErrorFn(response) {
          vm.notice_creation_failed = true;
          vm.notice_creation_failed_messages = response.data;
          vm.notice_creation_in_progress = false;
        }
      }

      function getCurrentUserErrorFn(response) {
        vm.notice_creation_failed = true;
        vm.notice_creation_failed_messages = response.data;
        vm.notice_creation_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
