(function () {
  'use strict';

  angular
    .module('vms2.notes.controllers')
    .controller('NotesController', NotesController);

  NotesController.$inject = ['$scope', '$mdDialog', '$mdMedia', 'Notes'];

  function NotesController($scope, $mdDialog, $mdMedia, Notes) {
    var vm = this;

    vm.notes = [];
    vm.displayed_notes = [];

    vm.openNewNotePopup = openNewNotePopup;

    activate();

    function activate() {
      $scope.$watchCollection(function () { return $scope.notes; }, render);
    }

    function render(current, original) {
      if (current != original) {
        vm.notes = [];
        vm.displayed_notes = [];

        for (var i = 0; i < current.length; i++) {
          vm.displayed_notes.push(current[i]);
          vm.notes.push(current[i]);
        }
      }
    }

    function openNewNotePopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        controller: 'NewNoteController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/notes/new-note.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(note) {
        vm.notes.push(note)
      }, function() {
        console.log("this asdasdasd");
      });

      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    }
  }
})();
