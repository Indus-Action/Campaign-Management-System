(function () {
  'use strict';

  angular
    .module('vms2.todos.directives')
    .directive('todo', todo);

  function todo() {
    var directive = {
      controller: 'TodoController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        todo: '=',
        parent: '='
      },
      templateUrl: '/static/templates/todos/todo.html'
    };

    return directive;
  }
})();
