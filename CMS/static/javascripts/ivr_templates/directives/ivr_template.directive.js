(function () {
  'use strict';

  angular
    .module('vms2.ivr_templates.directives')
    .directive('ivrt', ivr_template);

  function ivr_template() {
    var directive = {
      controller: 'IVRTemplateController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        ivrt: '=',
        parent: '='
      },
      templateUrl: '/static/templates/ivr_templates/ivr-template.html'
    };

    return directive;
  }
})();
