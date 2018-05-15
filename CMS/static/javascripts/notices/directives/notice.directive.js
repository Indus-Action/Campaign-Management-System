(function () {
  'use strict';

  angular
    .module('vms2.notices.directives')
    .directive('notice', notice);

  function notice() {
    var directive = {
      controller: 'NoticeController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        notice: '=',
        parent: '='
      },
      templateUrl: '/static/templates/notices/notice.html'
    };

    return directive;
  }
})();
