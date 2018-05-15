(function () {
  'use strict';

  angular
    .module('vms2.tasks', [
      'vms2.tasks.services',
      'vms2.tasks.directives',
      'vms2.tasks.controllers'
    ]);

  angular
    .module('vms2.tasks.directives', ['ngDialog']);

  angular
    .module('vms2.tasks.services', []);

  angular
    .module('vms2.tasks.controllers', ['ngMaterial', 'ngMessages']);
})();
