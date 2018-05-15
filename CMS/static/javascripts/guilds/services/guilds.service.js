(function () {
  'use strict';

  angular
    .module('vms2.guilds.services')
    .factory('Guilds', Guilds);

  Guilds.$inject = ['$http'];

  function Guilds($http) {
    var Guilds = {
      all: all,
      create: create,
      get: get,
      remove: remove,
      update: update,
      addUsers: addUsers,
      members: members
    };

    return Guilds;

    function addUsers(data) {
      return $http.post('/api/v1/guilds/add_users/', {
        data: data.data
      })
    }

    function all() {
      return $http.get('/api/v1/guilds/');
    }

    function create(data) {
      return $http.post('/api/v1/guilds/', {
        name: data.name,
        description: data.description
      });
    }

    function get(id) {
      return $http.get('/api/v1/guilds/' + id + '/');
    }

    function members(id) {
      return $http.get('/api/v1/users/guild/' + id + '/');
    }

    function remove(id) {
      return $http.delete('/api/v1/guilds/' + id + '/');
    }

    function update(guild) {
      return $http.put('/api/v1/guilds/' + guilds.id + '/', guild);
    }
  }
})();
