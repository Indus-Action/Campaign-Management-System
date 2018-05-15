(function () {
  'use strict';

  angular
    .module('vms2.forms.controllers')
    .controller('NewMessageFabController', NewMessageFabController);

  NewMessageFabController.$inject = ['$cookies', '$mdDialog', 'task', 'Auth', 'Messages', 'MessageTemplates'];

  function NewMessageFabController($cookies, $mdDialog, task, Auth, Messages, MessageTemplates) {
    var vm = this;

    vm.message_creation_in_progress = false;
    vm.message_creation_failed = false;
    vm.message_creation_failed_messages = [];

    vm.data = {};
    vm.message_templates = [];

    vm.createNewMessage = createNewMessage;
    vm.cancel = cancel;
    vm.onTemplateSelect = onTemplateSelect;

    activate();

    function activate() {
      Auth.getAuthenticatedUser($cookies.get('token'))
        .then(CurrentUserGetSuccessFn, CurrentUserGetErrorFn);

      MessageTemplates.all()
        .then(MessageTemplatesAllSuccessFn, MessageTemplatesAllErrorFn);

      function CurrentUserGetSuccessFn(response) {
        vm.data.sender = response.data.user.id;
        vm.data.beneficiary = task.beneficiary;
      }

      function CurrentUserGetErrorFn(response) {
        vm.message_creation_in_progress = false;
        vm.message_creation_failed = true;
        vm.message_creation_failed_messages = response.data;
      }

      function MessageTemplatesAllSuccessFn(response) {
        vm.message_templates = response.data;
      }

      function MessageTemplatesAllErrorFn(response) {
        console.log('Error while gettig message templates in NewMessageFabController');
      }
    }

    function createNewMessage() {
      Messages.create(vm.data)
        .then(MessageCreationSuccessFn, MessageCreationErrorFn);

      vm.message_creation_in_progress = true;

      function MessageCreationSuccessFn(response) {
        vm.message_creation_in_progress = false;
        $mdDialog.hide(response.data);
      }

      function MessageCreationErrorFn(response) {
        vm.message_creation_failed = true;
        vm.message_creation_failed_messages = response.data;
        vm.message_creation_in_progress = false;
      }
    }

    function onTemplateSelect() {
      vm.data.message = vm.message_template.body;
      vm.data.template = vm.message_template.id;
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
