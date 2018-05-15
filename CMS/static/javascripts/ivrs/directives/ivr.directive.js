(function () {
  'use strict';

  angular
    .module('vms2.ivrs.directives')
    .directive('ivr', ivr);

  function ivr() {
    var directive = {
      restrict: 'E',
      scope: {
        ivr: '=',
      },
      templateUrl: '/static/templates/ivrs/ivr.html'
    };

    return directive;
  }
})();
