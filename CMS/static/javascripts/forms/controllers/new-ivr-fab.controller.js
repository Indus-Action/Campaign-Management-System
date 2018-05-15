(function () {
  'use strict';

  angular
    .module('vms2.forms.controllers')
    .controller('NewIVRFabController', NewIVRFabController);

  NewIVRFabController.$inject = ['$cookies', '$mdDialog', 'task', 'Auth', 'IVRs', 'IVRTemplates'];

  function NewIVRFabController($cookies, $mdDialog, task, Auth, IVRs, IVRTemplates) {
    var vm = this;

    vm.ivr_creation_in_progress = false;
    vm.ivr_creation_failed = false;
    vm.ivr_creation_failed_messages = [];

    vm.data = {};
    vm.ivr_templates = [];

    vm.createNewIVR = createNewIVR;
    vm.cancel = cancel;
    vm.onTemplateSelect = onTemplateSelect;

    activate();

    function activate() {
      Auth.getAuthenticatedUser($cookies.get('token'))
        .then(CurrentUserGetSuccessFn, CurrentUserGetErrorFn);

      IVRTemplates.all()
        .then(IVRTemplatesAllSuccessFn, IVRTemplatesAllErrorFn);

      function CurrentUserGetSuccessFn(response) {
        var user = response.data;
        vm.data.sender = user.user.id;
        vm.data.beneficiary = task.beneficiary;
      }

      function CurrentUserGetErrorFn(response) {
        vm.ivr_creation_in_progress = false;
        vm.ivr_creation_failed = true;
        vm.ivr_creation_failed_messages = response.data;
      }

      function IVRTemplatesAllSuccessFn(response) {
        vm.ivr_templates = response.data;
      }

      function IVRTemplatesAllErrorFn(response) {
        console.log('Error while gettig message templates in NewIVRFabController');
      }
    }

    function createNewIVR() {
      IVRs.create(vm.data)
        .then(IVRCreationSuccessFn, IVRCreationErrorFn);

      vm.ivr_creation_in_progress = true;

      function IVRCreationSuccessFn(response) {
        vm.ivr_creation_in_progress = false;
        $mdDialog.hide(response.data);
      }

      function IVRCreationErrorFn(response) {
        vm.ivr_creation_failed = true;
        vm.ivr_creation_failed_messages = response.data;
        vm.ivr_creation_in_progress = false;
      }
    }

    function onTemplateSelect() {
      vm.data.exotel_app_id = vm.ivr_template.exotel_app_id;
      vm.data.template = vm.ivr_template.id;
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
