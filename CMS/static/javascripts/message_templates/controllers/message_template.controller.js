(function () {
  'use strict';

  angular
    .module('vms2.message_templates.controllers')
    .controller('MessageTemplateController', MessageTemplateController);

  MessageTemplateController.$inject = ['$scope', '$mdMedia', '$mdDialog', 'Auth', 'MessageTemplates'];

  function MessageTemplateController($scope, $mdMedia, $mdDialog, Auth, MessageTemplates) {
    var vm = this,
        template = $scope.templatej;

    vm.creator = null;

    vm.openEditMessageTemplatePopup = openEditMessageTemplatePopup;

    if (template) {
      if (template.creator) {
        Auth.get(template.creator)
          .then(messageTemplateCreatorGetSuccessFn, messageTemplateCreatorGetErrorFn);
      }
    }

    function messageTemplateCreatorGetSuccessFn(data, status, headers, config) {
      vm.creator = data.data;
    }

    function messageTemplateCreatorGetErrorFn(data, status, headers, config) {
      console.log('Error while getting note creator in NoteController');
    }

    function openEditMessageTemplatePopup(template, ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {data: template},
        controller: 'EditMessageTemplateController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/message_templates/edit-message-template.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(data) {
        MessageTemplates.all()
          .then(MessageTemplatesAllSuccessFn, MessageTemplatesAllErrorFn);
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function MessageTemplatesAllSuccessFn(data, status, headers, config) {
      $scope.parent.templates = data.data;
    }

    function MessageTemplatesAllErrorFn(data, status, headers, config) {
      console.log('Error while getting message templates');
    }
  }
})();
