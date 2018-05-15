(function () {
  'use strict';

  angular
    .module('vms2.todos.services')
    .factory('Todos', Todos);

  Todos.$inject = ['$http'];

  function Todos($http) {
    var Todos = {
      all: all,
      create: create,
      get: get,
      update: update,
      remove: remove,
      getBeneficiaryTodos: getBeneficiaryTodos,
      getAssignedTodos: getAssignedTodos,
      getCreatedTodos: getCreatedTodos
    };

    return Todos;

    function all() {
      return $http.get('/api/v1/todos/');
    }

    function create(data) {
      return $http.post('/api/v1/todos/', {
        todo: data.todo,
        reporter: data.reporter.id,
        assignee: data.assignee.id,
        beneficiary: data.beneficiary,
        due_date: data.due_date.getFullYear() + '-' + data.due_date.getMonth() + '-' + data.due_date.getDate()
      });
    }

    function get(id) {
      return $http.get('/api/v1/todos/' + id + '/');
    }

    function update(todo) {
      return $http.put('/api/v1/todos/' + todo.id + '/', todo);
    }

    function remove(todo) {
      return $http.delete('/api/v1/todos/' + todo.id + '/');
    }

    function getBeneficiaryTodos(user) {
      return $http.get('/api/v1/todos/beneficiary/' + user + '/');
    }

    function getAssignedTodos(user) {
      return $http.get('/api/v1/todos/assignee/' + user + '/');
    }

    function getCreatedTodos(user) {
      return $http.get('/api/v1/todos/creator/' + user + '/');
    }
  }
})();
