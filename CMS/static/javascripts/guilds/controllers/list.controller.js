(function () {
  'use strict';

  angular
    .module('vms2.guilds.controllers')
    .controller('GuildListController', GuildListController);

  GuildListController.$inject = ['Guilds'];

  function GuildListController(Guilds) {
    var vm = this;

    vm.guilds = [];

    activate();

    function activate() {
      Guilds.all()
        .then(guildsAllSuccessFn, guildsAllErrorFn);

      function guildsAllSuccessFn(response) {
        vm.guilds = response.data;
      }

      function guildsAllErrorFn(response) {
        console.log('Error while getting guilds in GuildListController');
      }
    }
  }
})();
