(function () {
  'use strict';

  angular
    .module('vms2.message_templates.controllers')
    .controller('MessageTemplatesController', MessageTemplatesController);

  MessageTemplatesController.$inject = ['$scope', '$mdDialog', '$mdMedia', 'MessageTemplates'];

  function MessageTemplatesController($scope, $mdDialog, $mdMedia, MessageTemplates) {
    var vm = this;

    vm.templates = [];
    vm.displayed_templates = [];

    vm.openNewMessageTemplatePopup = openNewMessageTemplatePopup;

    activate();

    function activate() {
      $scope.$watchCollection(function () { return $scope.templates; }, render);
    }

    function render(current, original) {
      if (current != original) {
        vm.templates = [];
        vm.displayed_templates = [];

        for (var i = 0; i < current.length; i++) {
          vm.displayed_templates.push(current[i]);
          vm.templates.push(current[i]);
        }
      }
    }

    function openNewMessageTemplatePopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        controller: 'NewMessageTemplateController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/message_templates/new-message-template.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(message_template) {
        vm.templates.push(message_template)
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
