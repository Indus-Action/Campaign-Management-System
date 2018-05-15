(function () {
  'use strict';

  angular
    .module('vms2.messages.services')
    .factory('Messages', Messages);

  function Messages($http) {
    var Messages = {
      all: all,
      create: create,
      get: get,
      update: update,
      remove: remove,
      getBeneficiaryMessages: getBeneficiaryMessages,
      getSentMessages: getSentMessages
    };

    return Messages;

    function all() {
      return $http.get('/api/v1/messages/');
    }

    function get(id) {
      return $http.get('/api/v1/messages/' + id + '/');
    }

    function update(message) {
      return $http.put('/api/v1/messages/' + id + '/', message);
    }

    function create(data) {
      return $http.post('/api/v1/messages/', {
        message: data.message,
        sender: data.sender,
        beneficiary: data.beneficiary,
        template: data.template
      });
    }

    function remove(message) {
      return $http.delete('/api/v1/messages/' + message.id + '/');
    }

    function getBeneficiaryMessages(user) {
      return $http.get('/api/v1/messages/beneficiary/' + user + '/');
    }

    function getSentMessages(user) {
      return $http.get('/api/v1/messages/sender/' + user + '/');
    }
  }
})();
