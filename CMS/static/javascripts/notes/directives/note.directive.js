(function () {
  'use strict';

  angular
    .module('vms2.notes.directives')
    .directive('note', note);

  function note() {
    var directive = {
      controller: 'NoteController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        note: '=',
        parent: '='
      },
      templateUrl: '/static/templates/notes/note.html'
    };

    return directive;
  }
})();
