(function () {
  'use strict';

  angular
    .module('vms2.organisations.services')
    .factory('Organisations', Organisations);

  Organisations.$inject = ['$http', 'Locations'];

  function Organisations($http, Locations) {
    var Organisations = {
      all: all,
      create: create,
      get: get,
      update: update
    };

    return Organisations;

    function all() {
      return $http.get('/api/v1/organisations/');
    }

    function create(name, phone, location) {
      return $http.post('/api/v1/organisations/', {
        name: name,
        phone: phone,
        location: location
      });
    }

    function get(id) {
      return $http.get('/api/v1/organisations/' + id + '/');
    }

    function update(organisation) {
      return $http.put('/api/v1/organisations/' + organisation.id + '/', organisation);
    }
  }
})();
