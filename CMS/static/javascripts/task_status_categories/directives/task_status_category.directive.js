(function () {
  'use strict';

  angular
    .module('vms2.task_status_categories.directives')
    .directive('category', category);

  function category() {
    var directive = {
      controller: 'TaskStatusCategoryController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        category: '=',
        parent: '='
      },
      templateUrl: '/static/templates/task_status_categories/task_status_category.html'
    };

    return directive;
  }
})();
