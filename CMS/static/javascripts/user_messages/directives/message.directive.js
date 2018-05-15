(function () {
  'use strict';

  angular
    .module('vms2.messages.directives')
    .directive('message', message);

  function message() {
    var directive = {
      restrict: 'E',
      scope: {
        message: '=',
      },
      templateUrl: '/static/templates/user_messages/message.html'
    };

    return directive;
  }
})();
