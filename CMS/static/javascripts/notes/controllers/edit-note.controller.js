(function () {
  angular
    .module('vms2.notes.controllers')
    .controller('EditNoteController', EditNoteController);

  EditNoteController.$inject = ['Notes', '$mdDialog', 'data'];

  function EditNoteController(Notes, $mdDialog, data) {
    var vm = this;

    vm.note_edit_in_progress = false;
    vm.note_edit_failed = false;
    vm.note_edit_failed_messages = [];

    vm.data = data;

    vm.editNote = editNote;
    vm.deleteNote = deleteNote;
    vm.cancel = cancel;

    function editNote(data) {
      Notes.update(vm.data)
        .then(NoteEditSuccessFn, NoteEditErrorFn);

      vm.note_edit_in_progress = true;

      function NoteEditSuccessFn(data, status, headers, config) {
        vm.note_edit_in_progress = false;
        $mdDialog.hide(data);
      }

      function NoteEditErrorFn(data, status, headers, config) {
        vm.note_edit_failed = true;
        vm.note_edit_failed_messages = data.data;
        vm.note_edit_in_progress = false;
      }
    }

    function deleteNote() {
      Notes.remove(vm.data)
        .then(NoteDeleteSuccessFn, NoteDeleteErrorFn);

      vm.note_edit_in_progress = true;

      function NoteDeleteSuccessFn(data, status, headers, config) {
        vm.note_edit_in_progress = false;
        $mdDialog.hide(data);
      }

      function NoteDeleteErrorFn(data, status, headers, config) {
        vm.note_edit_failed = true;
        vm.note_edit_failed_messages = data.data;
        vm.note_edit_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
