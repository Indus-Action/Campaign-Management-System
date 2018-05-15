(function () {
  angular
    .module('vms2.notices.controllers')
    .controller('EditNoticeController', EditNoticeController);

  EditNoticeController.$inject = ['$mdDialog', 'data', 'Notices'];

  function EditNoticeController($mdDialog, data, Notices) {
    var vm = this;

    vm.notice_edit_in_progress = false;
    vm.notice_edit_failed = false;
    vm.notice_edit_failed_messages = [];

    vm.data = data;

    vm.editNotice = editNotice;
    vm.deleteNotice = deleteNotice;
    vm.cancel = cancel;

    function editNotice(data) {
      Notices.update(vm.data)
        .then(NoticeEditSuccessFn, NoticeEditErrorFn);

      vm.notice_edit_in_progress = true;

      function NoticeEditSuccessFn(response) {
        vm.notice_edit_in_progress = false;
        $mdDialog.hide(data);
      }

      function NoticeEditErrorFn(response) {
        vm.notice_edit_failed = true;
        vm.notice_edit_failed_messages = response.data;
        vm.notice_edit_in_progress = false;
      }
    }

    function deleteNotice() {
      Notices.remove(vm.data)
        .then(NoticeDeleteSuccessFn, NoticeDeleteErrorFn);

      vm.notice_edit_in_progress = true;

      function NoticeDeleteSuccessFn(response) {
        vm.notice_edit_in_progress = false;
        $mdDialog.hide(data);
      }

      function NoticeDeleteErrorFn(response) {
        vm.notice_edit_failed = true;
        vm.notice_edit_failed_messages = response.data;
        vm.notice_edit_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
