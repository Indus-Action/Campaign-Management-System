(function () {
  'use strict';

  angular
    .module('vms2.task_types.services')
    .factory('TaskTypes', TaskTypes);

  TaskTypes.$inject = ['$http', '$localStorage'];

  function TaskTypes($http, $localStorage) {
    var TaskTypes = {
      all: all,
      create: create,
      get: get,
      update: update,
      remove: remove,
      updateLocal: updateLocal,
      getTaskTypeFromLocalStorage: getTaskTypeFromLocalStorage
    };

    return TaskTypes;

    function all() {
      return $http.get('/api/v1/task_types/');
    }

    function create(data) {
      return $http.post('/api/v1/task_types/', {
        task_type: data.task_type,
        desc: data.description,
        points: data.points,
        feedback_type: data.feedback_type.id,
        training_kit: data.training_kit.id,
        form: data.form.id,
        sla: data.sla
      });
    }

    function get(id) {
      return $http.get('/api/v1/task_types/' + id + '/');
    }

    function update(task_type) {
      if (task_type.feedback_type) {
        task_type.feedback_type = task_type.feedback_type.id;
      }
      if (task_type.training_kit) {
        task_type.training_kit = task_type.training_kit.id;
      }
      if (task_type.form) {
        task_type.form = task_type.form.id;
      }
      return $http.put('/api/v1/task_types/' + task_type.id + '/', task_type);
    }

    function remove(task_type) {
      return $http.delete('/api/v1/task_types/' + task_type.id + '/');
    }

    function updateLocal() {
      all().then(updateLocalSuccess, updateLocalFailure);

      function updateLocalSuccess(response) {
        $localStorage.system_task_types = response.data;
        console.log("Local Storage for task types updated.");
      }
      function updateLocalFailure() {
        console.log("Failed to retrieve task types while updating local storage.");
      }
    }

    function getTaskTypeFromLocalStorage(id) {
      var system_task_types = $localStorage.system_task_types,
          task_type = null;

      // TODO: Improve this with promise
      if (system_task_types) {
        for (var t in system_task_types) {
          if (system_task_types[t].id === id) {
            task_type = system_task_types[t];
            break;
          }
        }
      }

      return task_type;
    }
  }
})();
