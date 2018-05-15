(function () {
  'use strict';

  angular
    .module('vms2.organisations.directives')
    .directive('organisations', organisations);

  function organisations() {
    var directive = {
      controller: 'OrganisationsController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        applications: '='
      },
      templateUrl: '/static/templates/organisations/organisations.html'
    };

    return directive;
  }
})();
