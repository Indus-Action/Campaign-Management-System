(function () {
  'use strict';

  angular
    .module('vms2.locations', [
      'vms2.locations.services',
      'vms2.locations.directives',
      'vms2.locations.controllers'
    ]);

  angular
    .module('vms2.locations.directives', ['ngDialog']);

  angular
    .module('vms2.locations.services', []);

  angular
    .module('vms2.locations.controllers', []);
})();
