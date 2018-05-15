(function () {
  'use strict';

  angular
    .module('vms2.ivr_templates.controllers')
    .controller('NewIVRTemplateController', NewIVRTemplateController);

  NewIVRTemplateController.$inject = ['$cookies', '$mdDialog', 'Auth', 'IVRTemplates'];

  function NewIVRTemplateController($cookies, $mdDialog, Auth, IVRTemplates) {
    var vm = this;

    vm.ivr_template_creation_in_progress = false;
    vm.ivr_template_creation_failed = false;
    vm.ivr_template_creation_failed_messages = [];

    vm.data = {};

    vm.createNewIVRTemplate = createNewIVRTemplate;
    vm.cancel = cancel;

    function createNewIVRTemplate() {
      Auth.getAuthenticatedUser($cookies.get('token'))
        .then(getCurrentUserSuccessFn, getCurrentUserErrorFn);

      vm.ivr_template_creation_in_progress = true;

      function getCurrentUserSuccessFn(response) {
        vm.data.creator = response.data.user.id;

        IVRTemplates.create(vm.data)
          .then(IVRTemplateCreationSuccessFn, IVRTemplateCreationErrorFn);

        vm.ivr_template_creation_in_progress = true;

        function IVRTemplateCreationSuccessFn(response) {
          vm.ivr_template_creation_in_progress = false;
          $mdDialog.hide(response.data);
        }

        function IVRTemplateCreationErrorFn(response) {
          vm.ivr_template_creation_failed = true;
          vm.ivr_template_creation_failed_messages = response.data;
          vm.ivr_template_creation_in_progress = false;
        }
      }

      function getCurrentUserErrorFn(response) {
        vm.ivr_template_creation_failed = true;
        vm.ivr_template_creation_failed_messages = response.data;
        vm.ivr_template_creation_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
