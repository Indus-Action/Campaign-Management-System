(function () {
  'use strict';

  angular
    .module('vms2.messages.controllers')
    .controller('NewMessageController', NewMessageController);

  NewMessageController.$inject = ['Messages', 'Auth', 'MessageTemplates', '$mdDialog', '$cookies', '$routeParams'];

  function NewMessageController(Messages, Auth, MessageTemplates, $mdDialog, $cookies, $routeParams) {
    var vm = this;

    vm.message_creation_in_progress = false;
    vm.message_creation_failed = false;
    vm.message_creation_failed_messages = [];

    vm.data = {};

    vm.createNewMessage = createNewMessage;
    vm.cancel = cancel;
    vm.onTemplateSelect = onTemplateSelect;

    activate();

    function activate() {
      Auth.getAuthenticatedUser($cookies.get('token'))
        .then(getCurrentUserSuccessFn, getCurrentUserErrorFn);

      MessageTemplates.all()
        .then(MessageTemplatesAllSuccessFn, MessageTemplatesAllErrorFn);

      function getCurrentUserSuccessFn(data, status, headers, config) {
        vm.data.sender = data.data.user.id;
        vm.data.beneficiary = Number($routeParams.id);
      }

      function getCurrentUserErrorFn(data, status, headers, config) {
        vm.message_creation_failed = true;
        vm.message_creation_failed_messages = data.data;
        vm.message_creation_in_progress = false;
      }

      function MessageTemplatesAllSuccessFn(data, status, headers, config) {
        vm.message_templates = data.data;
      }

      function MessageTemplatesAllErrorFn(data, status, headers, config) {
        console.log('Error while getting message templates');
      }
    }

    function createNewMessage() {
      Messages.create(vm.data)
        .then(MessageCreationSuccessFn, MessageCreationErrorFn);

      vm.message_creation_in_progress = true;

      function MessageCreationSuccessFn(data, status, headers, config) {
        vm.message_creation_in_progress = false;
        $mdDialog.hide(data.data);
      }

      function MessageCreationErrorFn(data, status, headers, config) {
        vm.message_creation_failed = true;
        vm.message_creation_failed_messages = data.data;
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
