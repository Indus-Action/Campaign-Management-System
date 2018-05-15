(function () {
  'use strict';

  angular
    .module('vms2.todos.controllers')
    .controller('TodosListController', TodosListController);

  TodosListController.$inject = ['$cookies', 'Auth', 'Todos'];

  function TodosListController($cookies, Auth, Todos) {
    var vm = this;

    vm.todos = [];
    vm.user = null;

    activate();

    function activate() {
      Auth.getAuthenticatedUser($cookies.get('token'))
        .then(authenticatedUserGetSuccessFn, authenticatedUserGetErrorFn);

      function authenticatedUserGetSuccessFn(response) {
        vm.user = response.data.user;

        Todos.getAssignedTodos(vm.user.id)
          .then(todosGetSuccessFn, todosGetErrorFn);

        function todosGetSuccessFn(response) {
          vm.todos = response.data;
        }

        function todosGetErrorFn(response) {
          console.log('Error while getting todos in TodosListController');
        }
      }

      function authenticatedUserGetErrorFn(response) {
        console.log('Error while getting authenticated user in TodosListController');
      }
    }
  }
})();
