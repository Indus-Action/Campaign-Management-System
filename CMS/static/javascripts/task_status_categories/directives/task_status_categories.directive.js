(function () {
  'use strict';

  angular
    .module('vms2.task_status_categories.directives')
    .directive('categories', categories);

  function categories() {
    var directive = {
      controller: 'TaskStatusCategoriesController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        categories: '='
      },
      templateUrl: '/static/templates/task_status_categories/task_status_categories.html'
    };

    return directive;
  }
})();
