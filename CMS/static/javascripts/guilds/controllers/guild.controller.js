(function () {
  'use strict';

  angular
    .module('vms2.guilds.controllers')
    .controller('GuildController', GuildController);

  GuildController.$inject = ['$scope', '$mdMedia', '$mdDialog', 'Auth', 'Guilds'];

  function GuildController($scope, $mdMedia, $mdDialog, Auth, Guilds) {
    var vm = this,
        guild = $scope.guild;

    vm.creator = null;

    vm.openEditGuildPopup = openEditGuildPopup;
    vm.addUsers = addUsers;
    vm.data = {};

    vm.data.guild = guild.id;

    function processNumbers(numbers){
      numbers.data.splice(-1, 1);

      Guilds.addUsers(numbers)
        .then(addUsersSuccessFn, addUsersErrorFn);

      function addUsersSuccessFn(response) {
        console.log('Success');
      }

      function addUsersErrorFn(response) {
        console.log('Error while adding users to the guild in GuildController');
      }
    }

    function addUsers() {
      var fileInput = document.getElementById('fileInput'),
          file = fileInput.files[0],
          textType = /text.*/;

      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: processNumbers
      });
    }

    function openEditGuildPopup(guild, ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {data: guild},
        controller: 'EditGuildController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/guilds/edit-guild.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(data) {
        Guilds.all()
          .then(guildsGetSuccessFn, guildsGetErrorFn);
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function guildsGetSuccessFn(response) {
      $scope.parent.guilds = response.data;
    }

    function guildsGetErrorFn(response) {
      console.log('Error while getting guilds in GuildController');
    }
  }
})();
