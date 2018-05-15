(function () {
  'use strict';

  angular
    .module('vms2.space_types.services')
    .factory('SpaceTypes', SpaceTypes);

  SpaceTypes.$inject = ['$http'];

  function SpaceTypes($http) {
    var SpaceTypes = {
      all: all,
      create: create,
      get: get,
      remove: remove,
      update: update,
      addSpaces: addSpaces
    };

    return SpaceTypes;

    function all() {
      return $http.get('/api/v1/space_types/');
    }

    function create(data) {
      return $http.post('/api/v1/space_types/', {
        name: data.name,
        desc: data.desc
      });
    }

    function get(id) {
      return $http.get('/api/v1/space_types/' + id + '/');
    }

    function remove(id) {
      return $http.delete('/api/v1/space_types/' + id + '/');
    }

    function update(space_time) {
      return $http.put('/api/v1/space_types/' + space_time.id + '/', space_time);
    }

    function addSpaces(data) {
      return $http.post('/api/v1/space_types/add_spaces/', {
        spaces: data.spaces,
        space_type: data.space_type
      });
    }
  }
})();
