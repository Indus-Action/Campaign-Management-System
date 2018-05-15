(function () {
  'use strict';

  angular
    .module('vms2.message_templates.controllers')
    .controller('NewMessageTemplateController', NewMessageTemplateController);

  NewMessageTemplateController.$inject = ['MessageTemplates', 'Auth', '$mdDialog', '$cookies'];

  function NewMessageTemplateController(MessageTemplates, Auth, $mdDialog, $cookies) {
    var vm = this;

    vm.message_template_creation_in_progress = false;
    vm.message_template_creation_failed = false;
    vm.message_template_creation_failed_messages = [];

    vm.data = {};

    vm.createNewMessageTemplate = createNewMessageTemplate;
    vm.cancel = cancel;

    function createNewMessageTemplate() {
      Auth.getAuthenticatedUser($cookies.get('token'))
        .then(getCurrentUserSuccessFn, getCurrentUserErrorFn);

      vm.message_template_creation_in_progress = true;

      function getCurrentUserSuccessFn(data, status, headers, config) {
        vm.data.creator = data.data.user.id;

        MessageTemplates.create(vm.data)
          .then(MessageTemplateCreationSuccessFn, MessageTemplateCreationErrorFn);

        vm.message_template_creation_in_progress = true;

        function MessageTemplateCreationSuccessFn(data, status, headers, config) {
          vm.message_template_creation_in_progress = false;
          $mdDialog.hide(data.data);
        }

        function MessageTemplateCreationErrorFn(data, status, headers, config) {
          vm.message_template_creation_failed = true;
          vm.message_template_creation_failed_messages = data.data;
          vm.message_template_creation_in_progress = false;
        }
      }

      function getCurrentUserErrorFn(data, status, headers, config) {
        vm.message_template_creation_failed = true;
        vm.message_template_creation_failed_messages = data.data;
        vm.message_template_creation_in_progress = false;
      }

    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
