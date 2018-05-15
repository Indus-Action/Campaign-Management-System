(function () {
  'use strict';

  angular
    .module('vms2.guilds.directives')
    .directive('guild', guild);

  function guild() {
    var directive = {
      controller: 'GuildController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        guild: '=',
        parent: '='
      },
      templateUrl: '/static/templates/guilds/guild.html'
    };

    return directive;
  }
})();
