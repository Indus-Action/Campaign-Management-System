(function () {
  'use strict';

  angular
    .module('vms2.calls.services')
    .factory('Calls', Calls);

  function Calls($http) {
    var Calls = {
      all: all,
      create: create,
      update: update,
      remove: remove,
      allForBeneficiary: allForBeneficiary,
      allForCaller: allForCaller,
      $current_call: null
    };

    return Calls;

    function all() {
      return $http.get('/api/v1/calls/');
    }

    function create(data) {
      return $http.post('/api/v1/calls/', {
        beneficiary: data.beneficiary,
        task: data.task,
      });
    }

    function update(call) {
      return $http.put('/api/v1/calls/' + call.id + '/', call);
    }

    function remove(call) {
      return $http.delete('/api/v1/calls/' + call.id + '/');
    }

    function allForBeneficiary(beneficiary_id) {
      return $http.get('/api/v1/calls/beneficiary/' + beneficiary_id + '/');
    }

    function allForCaller(caller_id) {
      return $http.get('/api/v1/calls/caller/' + caller_id + '/');
    }
  }
})();
