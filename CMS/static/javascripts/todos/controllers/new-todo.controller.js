(function () {
  'use strict';

  angular
    .module('vms2.todos.controllers')
    .controller('NewTodoController', NewTodoController);

  NewTodoController.$inject = ['Todos', 'Auth', '$cookies', '$mdDialog', '$routeParams'];

  function NewTodoController(Todos, Auth, $cookies, $mdDialog, $routeParams) {
    var vm = this;

    vm.data = {};
    vm.helpline_operators = [];

    vm.todo_creation_in_progress = false;
    vm.todo_creation_failed = false;
    vm.todo_creation_failed_messages = [];

    vm.createNewTodo = createNewTodo;

    vm.loadUsers = loadUsers;

    activate();

    function activate() {
      Auth.getAuthenticatedUser($cookies.get('token'))
        .then(loggedInUserGetSuccessFn, loggedInUserGetErrorFn);

      function loggedInUserGetSuccessFn(data, status, headers, config) {
        vm.data.reporter = data.data;
        vm.data.beneficiary = $routeParams.id;
      }

      function loggedInUserGetErrorFn(data, status, headers, config) {
        console.log('User not logged in');
      }
    }

    function loadUsers() {
      Auth.getUserListByType('HL')
        .then(helplineGetSuccessFn, helplineGetErrorFn);
    }

    function helplineGetSuccessFn(data, status, headers, config) {
      vm.helpline_operators = data.data;
    }

    function helplineGetErrorFn(data, status, headers, config) {
      console.log('Error while getting helpline operators');
    }

    function createNewTodo() {
      Todos.create(vm.data)
        .then(todoCreateSuccessFn, todoCreateErrorFn);

      vm.todo_creation_in_progress = true;

      function todoCreateSuccessFn(data, status, headers, config) {
        vm.todo_creation_in_progress = false;
        $mdDialog.hide(data.data);
      }

      function todoCreateErrorFn(data, status, headers, config) {
        vm.todo_creation_in_progress = false;
        vm.todo_creation_failed = true;
        vm.todo_creation_failed_messages = data.data;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
