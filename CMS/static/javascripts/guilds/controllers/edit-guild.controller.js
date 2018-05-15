(function () {
  'use strict';

  angular
    .module('vms2.guilds.controllers')
    .controller('EditGuildController', EditGuildController);

  EditGuildController.$inject = ['$mdDialog', 'data', 'Guilds'];

  function EditGuildController($mdDialog, data, Guilds) {
    var vm = this;

    vm.guild_edit_in_progress = false;
    vm.guild_edit_failed = false;
    vm.guild_edit_failed_messages = false;

    vm.data = data;

    vm.deleteGuild = deleteGuild;
    vm.editGuild = editGuild;
    vm.cancel = cancel;

    function deleteGuild() {
      Guilds.remove(vm.data.id)
        .then(guildDeleteSuccessFn, guildDeleteErrorFn);

      function guildDeleteSuccessFn(response) {
        vm.guild_edit_in_progress = false;
        $mdDialog.hide(response.data);
      }

      function guildDeleteErrorFn(response) {
        vm.guild_edit_failed = true;
        vm.guild_edit_failed_messages = response.data;
        vm.guild_edit_in_progress = false;
      }
    }

    function editGuild() {
      Guilds.update(vm.data)
        .then(guildEditSuccessFn, guildEditErrorFn);

      vm.guild_edit_in_progress = true;

      function guildEditSuccessFn(response) {
        vm.guild_edit_in_progress = false;
        $mdDialog.hide(response.data);
      }

      function guildEditErrorFn(response) {
        vm.guild_edit_failed = true;
        vm.guild_edit_failed_messages = response.data;
        vm.guild_edit_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
