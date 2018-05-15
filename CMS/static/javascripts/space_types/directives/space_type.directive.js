(function () {
  'use strict';

  angular
    .module('vms2.space_types.directives')
    .directive('spaceType', spaceType);

  function spaceType() {
    var directive = {
      controller: 'SpaceTypeController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        spaceType: '=',
        parent: '='
      },
      templateUrl: '/static/templates/space_types/space_type.html'
    };

    return directive;
  }
})();
