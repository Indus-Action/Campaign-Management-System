(function () {
  'use strict';

  angular
    .module('vms2.tasks.directives')
    .directive('task', task);

  function task() {
    var directive = {
      controller: 'TaskController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        task: '='
      },
      templateUrl: '/static/templates/tasks/task.html'
    };

    return directive;
  }
})();
