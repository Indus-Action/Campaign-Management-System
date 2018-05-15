(function () {
  'use strict';

  angular
    .module('vms2.ivrs.services')
    .factory('IVRs', IVRs);

  function IVRs($http) {
    var IVRs = {
      all: all,
      create: create,
      get: get,
      update: update,
      remove: remove,
      getBeneficiaryIVRs: getBeneficiaryIVRs,
      getSentIVRs: getSentIVRs
    };

    return IVRs;

    function all() {
      return $http.get('/api/v1/ivrs/');
    }

    function get(id) {
      return $http.get('/api/v1/ivrs/' + id + '/');
    }

    function update(ivr) {
      return $http.put('/api/v1/ivrs/' + id + '/', ivr);
    }

    function create(data) {
      return $http.post('/api/v1/ivrs/', {
        name: data.name,
        sender: data.sender,
        beneficiary: data.beneficiary,
        template: data.template,
        exotel_app_id: data.exotel_app_id
      });
    }

    function remove(ivr) {
      return $http.delete('/api/v1/ivrs/' + ivr.id + '/');
    }

    function getBeneficiaryIVRs(user) {
      return $http.get('/api/v1/ivrs/beneficiary/' + user + '/');
    }

    function getSentIVRs(user) {
      return $http.get('/api/v1/ivrs/sender/' + user + '/');
    }
  }
})();
