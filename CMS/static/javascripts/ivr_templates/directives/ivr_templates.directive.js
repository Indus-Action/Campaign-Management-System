(function () {
  'use strict';

  angular
    .module('vms2.ivr_templates.directives')
    .directive('ivrts', ivr_templates);

  function ivr_templates() {
    var directive = {
      controller: 'IVRTemplatesController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        ivrts: '='
      },
      templateUrl: '/static/templates/ivr_templates/ivr-templates.html'
    };

    return directive;
  }
})();
