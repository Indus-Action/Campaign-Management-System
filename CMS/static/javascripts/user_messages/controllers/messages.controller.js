(function () {
  'use strict';

  angular
    .module('vms2.messages.controllers')
    .controller('MessagesController', MessagesController);

  MessagesController.$inject = ['$scope', '$mdDialog', '$mdMedia', 'Messages'];

  function MessagesController($scope, $mdDialog, $mdMedia, Messages) {
    var vm = this;

    vm.messages = [];
    vm.displayed_messages = [];

    vm.openNewMessagePopup = openNewMessagePopup;

    activate();

    function activate() {
      $scope.$watchCollection(function () { return $scope.messages; }, render);
    }

    function render(current, original) {
      if (current != original) {
        vm.messages = [];
        vm.displayed_messages = [];

        for (var i = 0; i < current.length; i++) {
          vm.displayed_messages.push(current[i]);
          vm.messages.push(current[i]);
        }
      }
    }

    function openNewMessagePopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        controller: 'NewMessageController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/user_messages/new-message.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(message) {
        vm.messages.push(message)
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
