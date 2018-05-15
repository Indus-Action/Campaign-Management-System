(function () {
  'use strict';

  angular
    .module('vms2.notes.controllers')
    .controller('NewNoteController', NewNoteController);

  NewNoteController.$inject = ['Notes', 'Auth', '$routeParams', '$cookies', '$mdDialog'];

  function NewNoteController(Notes, Auth, $routeParams, $cookies, $mdDialog) {
    var vm = this;

    vm.note_creation_in_progress = false;
    vm.note_creation_failed = false;
    vm.note_creation_failed_messages = [];

    vm.data = {};

    vm.createNewNote = createNewNote;
    vm.cancel = cancel;

    function createNewNote() {
      Auth.getAuthenticatedUser($cookies.get('token'))
        .then(getCurrentUserSuccessFn, getCurrentUserErrorFn);

      vm.note_creation_in_progress = true;

      function getCurrentUserSuccessFn(data, status, headers, config) {
        vm.data.creator = data.data.id;
        vm.data.beneficiary = Number($routeParams.id);

        Notes.create(vm.data)
          .then(NoteCreationSuccessFn, NoteCreationErrorFn);

        function NoteCreationSuccessFn(data, status, headers, config) {
          vm.note_creation_in_progress = false;
          $mdDialog.hide(data.data);
        }

        function NoteCreationErrorFn(data, status, headers, config) {
          vm.note_creation_failed = true;
          vm.note_creation_failed_messages = data.data;
          vm.note_creation_in_progress = false;
        }
      }

      function getCurrentUserErrorFn(data, status, headers, config) {
        vm.note_creation_failed = true;
        vm.note_creation_failed_messages = data.data;
        vm.note_creation_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
