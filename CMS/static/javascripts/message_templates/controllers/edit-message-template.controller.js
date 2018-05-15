(function () {
  'use strict';

  angular
    .module('vms2.message_templates.controllers')
    .controller('EditMessageTemplateController', EditMessageTemplateController);

  EditMessageTemplateController.$inject = ['MessageTemplates', '$mdDialog', 'data'];

  function EditMessageTemplateController(MessageTemplates, $mdDialog, data) {
    var vm = this;

    vm.message_template_edit_in_progress = false;
    vm.message_template_edit_failed = false;
    vm.message_template_edit_failed_messages = [];

    vm.data = data;

    vm.editMessageTemplate = editMessageTemplate;
    vm.deleteMessageTemplate = deleteMessageTemplate;
    vm.cancel = cancel;

    function editMessageTemplate() {
      MessageTemplates.update(vm.data)
        .then(MessageTemplateEditSuccessFn, MessageTemplateEditErrorFn);

      vm.message_template_edit_in_progress = true;

      function MessageTemplateEditSuccessFn(data, status, headers, config) {
        vm.message_template_edit_in_progress = false;
        $mdDialog.hide(data);
      }

      function MessageTemplateEditErrorFn(data, status, headers, config) {
        vm.message_template_edit_failed = true;
        vm.message_template_edit_failed_messages = data.data;
        vm.message_template_edit_in_progress = false;
      }
    }

    function deleteMessageTemplate() {
      MessageTemplates.remove(vm.data)
        .then(MessageTemplateDeleteSuccessFn, MessageTemplateDeleteErrorFn);

      vm.message_template_edit_in_progress = true;

      function MessageTemplateDeleteSuccessFn(data, status, headers, config) {
        vm.message_template_edit_in_progress = false;
        $mdDialog.hide(data);
      }

      function MessageTemplateDeleteErrorFn(data, status, headers, config) {
        vm.message_template_edit_failed = true;
        vm.message_template_edit_failed_messages = data.data;
        vm.message_template_edit_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
