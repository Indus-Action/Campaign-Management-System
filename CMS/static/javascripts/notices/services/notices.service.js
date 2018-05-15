(function () {
  'use strict';

  angular
    .module('vms2.notices.services')
    .factory('Notices', Notices);

  Notices.$inject = ['$http'];

  function Notices($http) {
    var Notices = {
      all: all,
      create: create,
      get: get,
      remove: remove,
      update: update
    };

    return Notices;

    function all() {
      return $http.get('/api/v1/notices/');
    }

    function create(data) {
      return $http.post('/api/v1/notices/', {
        notice: data.notice,
        creator: data.creator
      });
    }

    function get(id) {
      return $http.get('/api/v1/notices/' + id + '/');
    }

    function remove(notice) {
      return $http.delete('/api/v1/notices/' + notice.id + '/');
    }

    function update(notice) {
      return $http.put('/api/v1/notices/' + notice.id + '/', notice);
    }
  }
})();
