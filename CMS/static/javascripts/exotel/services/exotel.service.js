(function () {
  'use strict';

  angular
    .module('vms2.exotel.services')
    .factory('Exotel', Exotel);

  Exotel.$inject = ['$http'];

  function Exotel($http) {
    var Exotel = {
      all: all,
      update: update,
      create: create
    };

    return Exotel;

    function all() {
      return $http.get('/api/v1/exotel/');
    }

    function create(data) {
      return $http.post('/api/v1/exotel/', {
        default_task_status: data.default_task_status,
        default_task_type: data.default_task_type,
        default_stage: data.default_stage,
        auto_assign: data.auto_assign
      });
    }

    function update(exotel) {
      return $http.put('/api/v1/exotel/' + exotel.id + '/', exotel);
    }
  }
})();
