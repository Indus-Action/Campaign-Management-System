(function () {
  'use strict';

  angular
    .module('vms2.message_templates.directives')
    .directive('templates', message_templates);

  function message_templates() {
    var directive = {
      controller: 'MessageTemplatesController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        templates: '='
      },
      templateUrl: '/static/templates/message_templates/message_templates.html'
    };

    return directive;
  }
})();
