(function () {
  'use strict';

  angular
    .module('vms2.tags.services')
    .factory('Tags', Tags);

  Tags.$inject = ['$http', '$localStorage'];

  function Tags($http, $localStorage) {
    var Tags = {
      all: all,
      allLight: allLight,
      get: get,
      getLight: getLight,
      create: create,
      update: update,
      remove: remove,
      allForUser: allForUser,
      allLightForUser: allLightForUser,
      removeUserFromTag: removeUserFromTag,
      addTag: addTag,
      addTags: addTags,
      getTagFromLocalStorage: getTagFromLocalStorage
    };

    return Tags;

    function all() {
      return $http.get('/api/v1/tags/');
    }

    function allLight() {
      return $http.get('/api/v1/light_tags/');
    }

    function get(id) {
      return $http.get('/api/v1/tags/' + id + '/');
    }

    function getLight(id) {
      return $http.get('/api/v1/light_tags/' + id + '/');
    }

    function create(data) {
      return $http.post('/api/v1/tags/', {
        tag: data.tag,
        desc: data.desc,
        mutually_exclusive_tags: data.exclusive_tags
      });
    }

    function update(tag) {
      return $http.put('/api/v1/tags/' + tag.id + '/', tag);
    }

    function remove(tag) {
      return $http.delete('/api/v1/tags/' + tag.id + '/');
    }

    function allForUser(user_id) {
      return $http.get('/api/v1/tags/user/' + user_id + '/');
    }

    function allLightForUser(user_id) {
      return $http.get('/api/v1/light_tags/user/' + user_id + '/');
    }

    function addTag(user_id, tag_id) {
      return $http.post('/api/v1/add_tag/', {
        user_id: user_id,
        tag_id: tag_id
      });
    }

    function addTags(user_id, tag_ids) {
      return $http.post('/api/v1/add_tags/', {
        user_id: user_id,
        tag_ids: tag_ids
      });
    }

    function removeUserFromTag(user_id, tag_id) {
      return $http.post('/api/v1/remove_tag/', {
        user_id: user_id,
        tag_id: tag_id
      });
    }

    function removeExclusiveTagFromTag(tag_id, ex_tag_id) {
      return $http.post('/api/v1/remove_mutually_exclusive_tag/', {
        tag_id: tag_id,
        ex_tag_id: ex_tag_id
      });
    }

    function getTagFromLocalStorage(id) {
      var tags = $localStorage.system_tags,
          tag = null;

      // TODO: Improve this with promise
      if (tags) {
        for (var t in tags) {
          if (tags[t].id === id) {
            tag = tags[t];
            break;
          }
        }
      }

      return tag;
    }
  }
})();
