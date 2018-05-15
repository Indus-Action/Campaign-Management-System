(function () {
  'use strict';

  angular
    .module('vms2.auth.controllers')
    .controller('ResetPasswordController', ResetPasswordController);

  ResetPasswordController.$inject = ['Auth'];

  function ResetPasswordController(Auth) {
    var vm = this;

    vm.resetPassword = resetPassword;
    vm.reset_in_progress = false;
    vm.email = '';
    vm.reset_failed_messages = [];

    vm.email_sent = false;

    function resetPassword() {
      Auth.resetPassword(vm.email)
        .then(resetPasswordEmailSentSuccessFn, resetPasswordEmailSentErrorFn);

      vm.reset_in_progress = true;

      function resetPasswordEmailSentSuccessFn(response) {
        vm.reset_in_progress = false;
        vm.email_sent = true;
      }

      function resetPasswordEmailSentErrorFn(resposne) {
        vm.reset_in_progress = false;
        vm.reset_failed = true;
        vm.reset_failed_messages = response.data;
      }
    }
  }
})();
