(function () {
  'use strict';

  angular
    .module('vms2.todos.controllers')
    .controller('EditTodoController', EditTodoController);

  EditTodoController.$inject = ['Todos', 'Auth', 'data', '$mdDialog'];

  function EditTodoController(Todos, Auth, data, $mdDialog) {
    var vm = this;

    vm.todo_edit_in_progress = false;
    vm.todo_edit_failed = false;
    vm.todo_edit_failed_messages = [];

    vm.data = data;
    vm.helpline_operators = [];

    vm.loadUsers = loadUsers;

    vm.editTodo = editTodo;
    vm.deleteTodo = deleteTodo;
    vm.cancel = cancel;


    function loadUsers() {
      Auth.getUserListByType('HL')
        .then(helplineGetSuccessFn, helplineGetErrorFn);

      function helplineGetSuccessFn(data, status, headers, config) {
        vm.helpline_operators = data.data;
      }

      function helplineGetErrorFn(data, status, headers, config) {
        console.log('Error while getting helpline operators');
      }
    }

    function editTodo() {
      Todos.update(vm.data)
        .then(TodoEditSuccessFn, TodoEditErrorFn);

      vm.todo_edit_in_progress = true;

      function TodoEditSuccessFn(data, status, headers, config) {
        vm.todo_edit_in_progress = false;
        $mdDialog.hide(data);
      }

      function TodoEditErrorFn(data, status, headers, config) {
        vm.todo_edit_in_progress = false;
        vm.todo_edit_failed_messages = data.data;
        vm.todo_edit_failed = true;
      }
    }

    function deleteTodo() {
      Todos.remove(vm.data)
        .then(TodoDeleteSuccessFn, TodoDeleteErrorFn);

      vm.todo_edit_in_progress = true;

      function TodoDeleteSuccessFn(data, status, headers, config) {
        vm.todo_edit_in_progress = false;
        $mdDialog.hide(data);
      }

      function TodoDeleteErrorFn(data, status, headers, config) {
        vm.todo_edit_failed = true;
        vm.todo_edit_failed_messages = data.data;
        vm.todo_edit_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
