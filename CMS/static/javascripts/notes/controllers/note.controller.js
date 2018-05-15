(function () {
  'use strict';

  angular
    .module('vms2.notes.controllers')
    .controller('NoteController', NoteController);

  NoteController.$inject = ['$scope', '$mdMedia', '$mdDialog', 'Auth', 'Notes'];

  function NoteController($scope, $mdMedia, $mdDialog, Auth, Notes) {
    var vm = this,
        note = $scope.note;

    vm.creator = null;

    vm.openEditNotePopup = openEditNotePopup;

    if (note) {
      if (note.creator) {
        Auth.get(note.creator)
          .then(noteCreatorGetSuccessFn, noteCreatorGetErrorFn);
      }
    }

    function noteCreatorGetSuccessFn(data, status, headers, config) {
      vm.creator = data.data;
    }

    function noteCreatorGetErrorFn(data, status, headers, config) {
      console.log('Error while getting note creator in NoteController');
    }

    function openEditNotePopup(note, ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {data: note},
        controller: 'EditNoteController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/notes/edit-note.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(data) {
        Notes.getBeneficiaryNotes(note.beneficiary)
          .then(beneficiaryNotesGetSuccessFn, beneficiaryNotesGetErrorFn);
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function beneficiaryNotesGetSuccessFn(data, status, headers, config) {
      $scope.parent.notes = data.data;
    }

    function beneficiaryNotesGetErrorFn(data, status, headers, config) {
      console.log('Error while getting beneficiary notes');
    }
  }
})();
