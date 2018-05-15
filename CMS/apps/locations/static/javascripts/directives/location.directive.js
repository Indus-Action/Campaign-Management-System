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
      templateUrl: '/static/templates/locations/location.html'
    };

    return directive;
  }
})();
