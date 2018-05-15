(function () {
  'use strict';

  angular
    .module('vms2.forms.directives')
    .directive('formEditorDirective', formEditorDirective);

  function formEditorDirective() {

    var formEditorDirective = {
      controller: 'FormEditorController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/forms/formeditor.html',
      restrict: 'E',
      scope: {
        form: '=',
        parentvm: '=',
        nested: '='
      }
    };

    return formEditorDirective;
  }
})();
