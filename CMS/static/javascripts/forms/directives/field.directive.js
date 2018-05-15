(function () {
  'use strict';

  angular
    .module('vms2.forms.directives')
    .directive('field', field);

  function field($http, $compile) {
    var getTemplateUrl = function(field) {
      return '/static/templates/forms/fields/' + field.type + '.html';
    };

    var linker = function(scope, elem) {
      var templateUrl = getTemplateUrl(scope.field);
      $http.get(templateUrl).success(function(data) {
        elem.html(data);
        $compile(elem.contents())(scope);
      });
    }
    var directive = {
      template: '',
      restrict: 'E',
      scope: {
        field: '='
      },
      link: linker,
      controller: 'FormFieldController',
      controllerAs: 'vm'
    };

    return directive;
  }
})();
