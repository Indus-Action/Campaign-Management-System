(function () {
  'use strict';

  angular
    .module('vms2.auth.controllers')
    .controller('AccountVerificationController', AccountVerificationController);

  AccountVerificationController.$inject = ['Auth', '$routeParams'];

  function AccountVerificationController(Auth, $routeParams) {
    var vm = this;
    vm.account_verified = false;
    vm.key = $routeParams.key;

    vm.performAccountVerification = function () {
      Auth.verifyEmail(
        vm.key
      ).then(verificationSuccessCallback, verificationFailureCallback);

      function verificationSuccessCallback(response) {
        vm.account_verified = true;
        console.log("Account verified.");
      }

      function verificationFailureCallback(response) {
        vm.account_verified = false;
        console.log("Account verification failed.");
      }
    };

    vm.performAccountVerification();
  }
})();
