(function () {
  'use strict';

  angular
    .module('vms2.forms', [
      'vms2.forms.services',
      'vms2.forms.directives',
      'vms2.forms.controllers'
    ]);

  angular
    .module('vms2.forms.services', []);

  angular
    .module('vms2.forms.directives', [
      'mgcrea.ngStrap'
    ]);

  angular
    .module('vms2.forms.controllers', [
      'ngDialog',
      'ui.bootstrap'
    ]);
})();
