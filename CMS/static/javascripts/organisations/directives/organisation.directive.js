(function () {
  'use strict';

  angular
    .module('vms2.organisations.directives')
    .directive('organisation', organisation);

  function organisation() {
    var directive = {
      restrict: 'E',
      scope: {
        organisation: '='
      },
      templateUrl: '/static/templates/organisations/organisation.html'
    };

    return directive;
  }
})();
