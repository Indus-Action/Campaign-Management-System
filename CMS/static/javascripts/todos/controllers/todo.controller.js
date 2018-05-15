(function () {
  'use strict';

  angular
    .module('vms2.todos.controllers')
    .controller('TodoController', TodoController);

  TodoController.$inject = ['$scope', '$mdMedia', '$mdDialog', 'Auth', 'Todos'];

  function TodoController($scope, $mdMedia, $mdDialog, Auth, Todos) {
    var vm = this,
        todo = $scope.todo;

    vm.reporter = null;

    vm.openEditTodoPopup = openEditTodoPopup;
    vm.updateTodo = updateTodo;

    if (todo) {
      if (todo.reporter) {
        Auth.get(todo.reporter)
          .then(todoReporterGetSuccessFn, todoReporterGetErrorFn);
      }
    }

    function todoReporterGetSuccessFn(data, status, headers, config) {
      vm.reporter = data.data;
    }

    function todoReporterGetErrorFn(data, status, headers, config) {
      console.log('Error while getting todo reporter in TodoController');
    }

    function updateTodo() {
      Todos.update(todo)
        .then(todoUpdatedSuccessFn, todoUpdatedErrorFn);
    }

    function todoUpdatedSuccessFn(data, status, headers, config) {
      console.log('Todo updated successfully');
    }

    function todoUpdatedErrorFn(data, status, headers, config) {
      console.log('Error while updating todo in TodoController');
    }

    function openEditTodoPopup(todo, ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {data: todo},
        controller: 'EditTodoController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/todos/edit-todo.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(data) {
        Todos.getBeneficiaryTodos(todo.beneficiary)
          .then(beneficiaryTodosGetSuccessFn, beneficiaryTodosGetErrorFn);
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function beneficiaryTodosGetSuccessFn(data, status, headers, config) {
      $scope.parent.todos = data.data;
    }

    function beneficiaryTodosGetErrorFn(data, status, headers, config) {
      console.log('Error while getting beneficiary todos');
    }
  }
})();
