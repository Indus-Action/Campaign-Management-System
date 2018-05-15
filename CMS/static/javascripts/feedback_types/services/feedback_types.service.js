(function () {
  'use strict';

  angular
    .module('vms2.feedback_types.services')
    .factory('FeedbackTypes', FeedbackTypes);

  function FeedbackTypes($http) {
    var FeedbackTypes = {
      all: all,
      create: create,
      get: get,
      update: update
    };

    return FeedbackTypes;

    function all() {
      return $http.get('/api/v1/feedback_types/');
    }

    function create(feedback_type) {
      return $http.post('/api/v1/feedback_types/', {
        feedback_type: feedback_type
      });
    }

    function get(id) {
      return $http.get('/api/v1/feedback_types/' + id + '/');
    }

    function update(feedback_type) {
      return $http.put('/api/v1/feedback_types/' + feedback_type + '/', feedback_type);
    }
  }
})();
