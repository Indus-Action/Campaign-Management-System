(function () {
  'use strict';

  angular
    .module('vms2.stages.services')
    .factory('Stages', Stages);

  Stages.$inject = ['$http', '$localStorage'];

  function Stages($http, $localStorage) {
    var Stages = {
      all: all,
      get: get,
      create: create,
      update: update,
      remove: remove,
      getStageFromLocalStorage: getStageFromLocalStorage
    };

    return Stages;

    function all() {
      return $http.get('/api/v1/stages/');
    }

    function get(id) {
      return $http.get('/api/v1/stages/' + id + '/');
    }

    function create(data) {
      return $http.post('/api/v1/stages/', {
        name: data.name,
        create_task_on_transition: data.create_task_on_transition,
        task_type: data.task_type.id,
        desc: data.desc
      });
    }

    function update(stage) {
      if (stage.task_type) {
        stage.task_type = stage.task_type.id;
      }

      return $http.put('/api/v1/stages/' + stage.id + '/', stage);
    }

    function remove(stage) {
      return $http.delete('/api/v1/stages/' + stage.id + '/');
    }

    function getStageFromLocalStorage(id) {
      var system_stages = $localStorage.system_stages,
          stage = null;

      // TODO: Improve this with promise
      if (system_stages) {
        for (var t in system_stages) {
          if (system_stages[t].id === id) {
            stage = system_stages[t];
            break;
          }
        }
      }

      return stage;
    }
  }
})();
