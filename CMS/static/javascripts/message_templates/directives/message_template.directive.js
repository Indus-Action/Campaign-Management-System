(function () {
  'use strict';

  angular
    .module('vms2.message_templates.directives')
    .directive('templatej', templatej);

  function templatej() {
    var directive = {
      controller: 'MessageTemplateController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        templatej: '=',
        parent: '='
      },
      templateUrl: '/static/templates/message_templates/message_template.html'
    };

    return directive;
  }
})();
