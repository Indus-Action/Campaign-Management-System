(function () {
  'use strict';

  angular
    .module('vms2.auth.controllers')
    .controller('PasswordResetConfirmController', PasswordResetConfirmController);

  PasswordResetConfirmController.$inject = ['Auth'];

  function PasswordResetConfirmController(Auth) {
    var vm = this;

    activate();

    function activate() {
      Auth.logout();
    }
  }
})();
