(function () {
  'use strict';

  angular
    .module('vms2.guilds.controllers')
    .controller('GuildsController', GuildsController);

  GuildsController.$inject = ['$scope', '$mdDialog', '$mdMedia', 'Guilds'];

  function GuildsController($scope, $mdDialog, $mdMedia, Guilds) {
    var vm = this;

    vm.guilds = [];
    vm.displayed_guilds = [];

    vm.openNewGuildPopup = openNewGuildPopup;

    activate();

    function activate() {
      $scope.$watchCollection(function () { return $scope.guilds; }, render);
    }

    function render(current, original) {
      if (current != original) {
        vm.guilds = [];
        vm.displayed_guilds = [];

        for (var i = 0; i < current.length; i++) {
          vm.displayed_guilds.push(current[i]);
          vm.guilds.push(current[i]);
        }
      }
    }

    function openNewGuildPopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        controller: 'NewGuildController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/guilds/new-guild.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(guild) {
        vm.guilds.push(guild)
      }, function() {
        console.log("this asdasdasd");
      });

      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    }
  }
})();
