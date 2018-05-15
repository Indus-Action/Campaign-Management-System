(function () {
  'use strict';

  angular
    .module('vms2.messages.directives')
    .directive('messages', messages);

  function messages() {
    var directive = {
      controller: 'MessagesController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        messages: '='
      },
      templateUrl: '/static/templates/user_messages/messages.html'
    };

    return directive;
  }
})();
