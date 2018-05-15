(function () {
  'use strict';

  angular
    .module('vms2.notices.directives')
    .directive('notices', notices);

  function notices() {
    var directive = {
      controller: 'NoticesController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        notices: '='
      },
      templateUrl: '/static/templates/notices/notices.html'
    };

    return directive;
  }
})();
