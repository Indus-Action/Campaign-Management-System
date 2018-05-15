(function () {
  'use strict';

  angular
    .module('vms2.guilds.controllers')
    .controller('NewGuildController', NewGuildController);

  NewGuildController.$inject = ['$mdDialog', 'Guilds'];

  function NewGuildController($mdDialog, Guilds) {
    var vm = this;

    vm.guild_creation_in_progress = false;
    vm.guild_creation_failed = false;
    vm.guild_creation_failed_messages = false;

    vm.data = {};

    vm.createNewGuild = createNewGuild;
    vm.cancel = cancel;

    function createNewGuild() {
      Guilds.create(vm.data)
        .then(guildCreateSuccessFn, guildCreateErrorFn);

      vm.guild_creation_in_progress = true;

      function guildCreateSuccessFn(response) {
        vm.guild_creation_in_progress = false;
        $mdDialog.hide(response.data);
      }

      function guildCreateErrorFn(response) {
        vm.guild_creation_failed = true;
        vm.guild_creation_failed_messages = response.data;
        vm.guild_creation_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
