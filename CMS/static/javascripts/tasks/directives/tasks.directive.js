(function () {
  'use strict';

  angular
    .module('vms2.tasks.directives')
    .directive('tasks', tasks);

  function tasks() {
    var directive = {
      controller: 'TasksController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        tasks: '='
      },
      templateUrl: '/static/templates/tasks/tasks.html'
    };

    return directive;
  }
})();
