(function () {
  'use strict';

  angular
    .module('vms2.ivr_templates.controllers')
    .controller('EditIVRTemplateController', EditIVRTemplateController);

  EditIVRTemplateController.$inject = ['IVRTemplates', '$mdDialog', 'data'];

  function EditIVRTemplateController(IVRTemplates, $mdDialog, data) {
    var vm = this;

    vm.ivr_template_edit_in_progress = false;
    vm.ivr_template_edit_failed = false;
    vm.ivr_template_edit_failed_messages = [];

    vm.data = data;

    vm.editIVRTemplate = editIVRTemplate;
    vm.deleteIVRTemplate = deleteIVRTemplate;
    vm.cancel = cancel;

    function editIVRTemplate() {
      IVRTemplates.update(vm.data)
        .then(IVRTemplateEditSuccessFn, IVRTemplateEditErrorFn)

      vm.ivr_template_edit_in_progress = true;

      function IVRTemplateEditSuccessFn(response) {
        vm.ivr_template_edit_in_progress = false;
        $mdDialog.hide(response.data);
      }

      function IVRTemplateEditErrorFn(response) {
        vm.ivr_template_edit_failed = true;
        vm.ivr_template_edit_failed_messages = response.data;
        vm.ivr_template_edit_in_progress = false;
      }
    }

    function deleteIVRTemplate() {
      IVRTemplates.remove(vm.data)
        .then(IVRTemplateDeleteSuccessFn, IVRTemplateDeleteErrorFn);

      vm.ivr_template_edit_in_progress = true;

      function IVRTemplateDeleteSuccessFn(response) {
        vm.ivr_templates_edit_in_progess = true;
        $mdDialog.hide(response);
      }

      function IVRTemplateDeleteErrorFn(response) {
        vm.ivr_template_edit_failed = true;
        vm.ivr_template_edit_failed_messages = response.data;
        vm.ivr_template_edit_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
