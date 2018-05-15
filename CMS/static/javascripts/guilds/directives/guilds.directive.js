(function () {
  'use strict';

  angular
    .module('vms2.guilds.directives')
    .directive('guilds', guilds);

  function guilds() {
    var directive = {
      controller: 'GuildsController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        guilds: '='
      },
      templateUrl: '/static/templates/guilds/guilds.html'
    };

    return directive;
  }
})();
