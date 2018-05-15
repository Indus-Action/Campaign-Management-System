(function () {
  'use strict';

  angular
    .module('vms2.locations.directives')
    .directive('location', location);

  function location() {
    var directive = {
      restrict: 'E',
      scope: {
        location: '='
      },
      templateUrl: '/apps/locations/static/templates/location.html'
    };

    return directive;
  }
})();
