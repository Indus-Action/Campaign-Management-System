(function () {
  'use strict';

  angular
    .module('vms2.auth', [
      'vms2.auth.services',
      'vms2.auth.controllers'
    ]);

  angular
    .module('vms2.auth.services', []);

  angular
    .module('vms2.auth.controllers', [
      'ngCookies'
      ]);
})();
