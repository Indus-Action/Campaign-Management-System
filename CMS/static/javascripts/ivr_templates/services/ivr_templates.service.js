(function () {
  'use strict';

  angular
    .module('vms2.ivr_templates.services')
    .factory('IVRTemplates', IVRTemplates);

  function IVRTemplates($http) {
    var IVRTemplates = {
      all: all,
      create: create,
      get: get,
      update: update,
      remove: remove
    };

    return IVRTemplates;

    function all() {
      return $http.get('/api/v1/ivr_templates/');
    }

    function create(data) {
      return $http.post('/api/v1/ivr_templates/', {
        title: data.title,
        exotel_app_id: data.exotel_app_id,
        creator: data.creator
      });
    }

    function get(id) {
      return $http.get('/api/v1/ivr_templates/' + id + '/');
    }

    function update(template) {
      return $http.put('/api/v1/ivr_templates/' + template.id + '/', template);
    }

    function remove(template) {
      return $http.delete('/api/v1/ivr_templates/' + template.id + '/');
    }
  }
})();
