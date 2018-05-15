(function () {
  'use strict';

  angular
    .module('vms2.event_conditions.services')
    .factory('EventConditions', EventConditions);

  EventConditions.$inject = ['$http'];

  function EventConditions($http) {
    var EventConditions = {
      all: all,
      allHelpline: allHelpline,
      allNormal: allNormal,
      create: create,
      get: get,
      remove: remove,
      update: update,
      getEventConditionTypes: getEventConditionTypes
    };

    return EventConditions;

    function all() {
      return $http.get('/api/v1/event_conditions/');
    }

    function allHelpline() {
      return $http.get('/api/v1/event_conditions/helpline/');
    }

    function allNormal() {
      return $http.get('/api/v1/event_conditions/normal/');
    }

    function create(data) {
      return $http.post('/api/v1/event_conditions/', {
        name: data.name,
        event_condition_type: data.event_condition_type,
        event_condition_category: data.event_condition_category,
        task_type: data.task_type,
        stage: data.stage,
        event_tags: data.event_tags,
        task_status: data.task_status,
        params: data.params
      });
    }

    function get(id) {
      return $http.get('/api/v1/event_conditions/' + id + '/');
    }

    function remove(id) {
      return $http.delete('/api/v1/event_conditions/' + id + '/');
    }

    function update(condition) {
      return $http.put('/api/v1/event_conditions/' + condition.id + '/', condition);
    }

    function getEventConditionTypes() {
      return $http.get('/api/v1/event_conditions/event_condition_types/');
    }
  }
})();
