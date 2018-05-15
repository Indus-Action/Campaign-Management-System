(function () {
  'use strict';

  angular
    .module('vms2.space_types.directives')
    .directive('spaceTypes', spaceTypes);

  function spaceTypes() {
    var directive = {
      controller: 'SpaceTypesController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        spaceTypes: '='
      },
      templateUrl: '/static/templates/space_types/space_types.html'
    };

    return directive;
  }
})();
