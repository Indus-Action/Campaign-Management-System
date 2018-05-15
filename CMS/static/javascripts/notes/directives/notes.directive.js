(function () {
  'use strict';

  angular
    .module('vms2.notes.directives')
    .directive('notes', notes);

  function notes() {
    var directive = {
      controller: 'NotesController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        notes: '='
      },
      templateUrl: '/static/templates/notes/notes.html'
    };

    return directive;
  }
})();
