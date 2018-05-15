(function () {
  'use strict';

  angular
    .module('vms2.interests.services')
    .factory('Interests', Interests);

  Interests.$inject = ['$http'];

  function Interests($http) {
    var Interests = {
      all: all,
      allLight: allLight,
      get: get,
      getLight: getLight,
      create: create,
      update: update,
      remove: remove,
      allForUser: allForUser,
      allLightForUser: allLightForUser,
      removeInterestsFromUser: removeInterestsFromUser,
      addInterests: addInterests
    };

    return Interests;

    function all() {
      return $http.get('/api/v1/interests/');
    }

    function allLight() {
      return $http.get('/api/v1/light_interests/');
    }

    function get(id) {
      return $http.get('/api/v1/interests/' + id + '/');
    }

    function getLight(id) {
      return $http.get('/api/v1/light_interests/' + id + '/');
    }

    function create(data) {
      return $http.post('/api/v1/interests/', {
        interest: data.interest,
        desc: data.desc
      });
    }

    function update(interest) {
      return $http.put('/api/v1/interests/' + interest.id + '/', interest);
    }

    function remove(interest) {
      return $http.delete('/api/v1/interests/' + interest.id + '/');
    }

    function allForUser(user_id) {
      return $http.get('/api/v1/interests/user/' + user_id + '/');
    }

    function allLightForUser(user_id) {
      return $http.get('/api/v1/light_interests/user/' + user_id + '/');
    }

    function addInterests(user_id, interest_ids) {
      return $http.post('/api/v1/add_interests/', {
        user_id: user_id,
        interest_ids: interest_ids
      });
    }

    function removeInterestsFromUser(user_id, interest_ids) {
      return $http.post('/api/v1/remove_interests/', {
        user_id: user_id,
        interest_ids: interest_ids
      });
    }
  }
})();
