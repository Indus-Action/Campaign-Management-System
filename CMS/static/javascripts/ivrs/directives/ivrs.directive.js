(function () {
  'use strict';

  angular
    .module('vms2.ivrs.directives')
    .directive('ivrs', ivrs);

  function ivrs() {
    var directive = {
      controller: 'IVRsController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        ivrs: '='
      },
      templateUrl: '/static/templates/ivrs/ivrs.html'
    };

    return directive;
  }
})();
