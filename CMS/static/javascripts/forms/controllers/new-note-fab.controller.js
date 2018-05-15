(function () {
  'use strict';

  angular
    .module('vms2.forms.controllers')
    .controller('NewNoteFabController', NewNoteFabController);

  NewNoteFabController.$inject = ['$cookies', '$mdDialog', '$routeParams', 'task', 'Auth', 'Notes'];

  function NewNoteFabController($cookies, $mdDialog, $routeParams, task, Auth, Notes) {
    var vm = this;

    vm.note_creation_in_progress = false;
    vm.note_creation_failed = false;
    vm.note_creation_failed_messages = [];

    vm.data = {};

    vm.createNewNote = createNewNote;
    vm.cancel = cancel;

    activate();

    function activate() {
      Auth.getAuthenticatedUser($cookies.get('token'))
        .then(getCurrentUserSuccessFn, getCurrentUserErrorFn);

      function getCurrentUserSuccessFn(response) {
        var user = response.data;
        vm.data.creator = user.user.id;
        vm.data.beneficiary = task.beneficiary;
      }

      function getCurrentUserErrorFn(response) {
        vm.note_creation_failed = true;
        vm.note_creation_failed_messages = data.data;
        vm.note_creation_in_progress = false;
      }
    }

    function createNewNote() {
      vm.note_creation_in_progress = true;

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

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
