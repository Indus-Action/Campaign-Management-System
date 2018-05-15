(function () {
  'use strict';

  angular
    .module('vms2.message_templates.services')
    .factory('MessageTemplates', MessageTemplates);

  function MessageTemplates($http) {
    var MessageTemplates = {
      all: all,
      create: create,
      get: get,
      update: update,
      remove: remove
    };

    return MessageTemplates;

    function all() {
      return $http.get('/api/v1/message_templates/');
    }

    function create(data) {
      return $http.post('/api/v1/message_templates/', {
        title: data.title,
        body: data.body,
        creator: data.creator
      });
    }

    function get(id) {
      return $http.get('/api/v1/message_templates/' + id + '/');
    }

    function update(template) {
      return $http.put('/api/v1/message_templates/' + template.id + '/', template);
    }

    function remove(template) {
      return $http.delete('/api/v1/message_templates/' + template.id + '/');
    }
  }
})();
