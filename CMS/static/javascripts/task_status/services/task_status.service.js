(function () {
  'use strict';

  angular
    .module('vms2.task_status.services')
    .factory('TaskStatus', TaskStatus);

  TaskStatus.$inject = ['$http', '$localStorage'];

  function TaskStatus($http, $localStorage) {
    var TaskStatus = {
      all: all,
      create: create,
      get: get,
      update: update,
      remove: remove,
      updateLocal: updateLocal,
      getTaskStatusFromLocalStorage: getTaskStatusFromLocalStorage
    };

    return TaskStatus;

    function all() {
      return $http.get('/api/v1/task_status/');
    }

    function create(data) {
      return $http.post('/api/v1/task_status/', {
        status: data.task_status,
        desc: data.description,
        category: data.category.id
      });
    }

    function get(id) {
      return $http.get('/api/v1/task_status/' + id + '/');
    }

    function update(task_status) {
      return $http.put('/api/v1/task_status/' + task_status.id + '/', task_status);
    }

    function remove(task_status) {
      return $http.delete('/api/v1/task_status/' + task_status.id + '/');
    }

    function updateLocal() {
      all().then(updateLocalSuccess, updateLocalFailure);

      function updateLocalSuccess(response) {
        $localStorage.system_task_status = response.data;
        console.log("Local Storage for task status updated.");
      }
      function updateLocalFailure() {
        console.log("Failed to retrieve task status while updating local storage.");
      }
    }

    function getTaskStatusFromLocalStorage(id) {
      var system_task_status = $localStorage.system_task_status,
          task_status = null;

      // TODO: Improve this with promise
      if (system_task_status) {
        for (var t in system_task_status) {
          if (system_task_status[t].id === id) {
            task_status = system_task_status[t];
            break;
          }
        }
      }

      return task_status;
    }
  }
})();
