(function () {
  'use strict';

  angular
    .module('vms2.notes.services')
    .factory('Notes', Notes);

  function Notes($http) {
    var Notes = {
      all: all,
      create: create,
      get: get,
      update: update,
      remove: remove,
      getBeneficiaryNotes: getBeneficiaryNotes,
      getCreatedNotes: getCreatedNotes
    };

    return Notes;

    function all() {
      return $http.get('/api/v1/notes/');
    }

    function get(id) {
      return $http.get('/api/v1/notes/' + id + '/');
    }

    function update(note) {
      return $http.put('/api/v1/notes/' + note.id + '/', note);
    }

    function create(data) {
      return $http.post('/api/v1/notes/', {
        note: data.note,
        creator: data.creator,
        beneficiary: data.beneficiary
      });
    }

    function remove(note) {
      return $http.delete('/api/v1/notes/' + note.id + '/');
    }

    function getBeneficiaryNotes(user) {
      return $http.get('/api/v1/notes/beneficiary/' + user + '/');
    }

    function getCreatedNotes(user) {
      return $http.get('/api/v1/notes/creator/' + user + '/');
    }
  }
})();
