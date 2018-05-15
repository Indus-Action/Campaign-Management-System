(function () {
  'use strict';

  angular
    .module('vms2.ivrs.controllers')
    .controller('NewIVRController', NewIVRController);

  NewIVRController.$inject = ['$cookies', '$mdDialog', '$routeParams', 'Auth', 'IVRs', 'IVRTemplates', 'Tasks'];

  function NewIVRController($cookies, $mdDialog, $routeParams, Auth, IVRs, IVRTemplates, Tasks) {
    var vm = this;

    vm.ivr_creation_in_progress = false;
    vm.ivr_creation_failed = false;
    vm.ivr_creation_failed_messages = [];

    vm.data = {};

    vm.createNewIVR = createNewIVR;
    vm.cancel = cancel;
    vm.onTemplateSelect = onTemplateSelect;

    activate();

    function activate() {
      var task_id = $routeParams.task_id;

      Auth.getAuthenticatedUser($cookies.get('token'))
        .then(getCurrentUserSuccessFn, getCurrentUserErrorFn);

      IVRTemplates.all()
        .then(IVRTemplatesAllSuccessFn, IVRTemplatesAllErrorFn);

      function getCurrentUserSuccessFn(response) {
        vm.data.sender = response.data.user.id;
        Tasks.get(task_id)
          .then(taskGetSuccessFn, taskGetErrorFn);

        function taskGetSuccessFn(response) {
          vm.data.beneficiary = response.data.beneficiary;
        }

        function taskGetErrorFn(response) {
          console.log('Error while getting task in NewIVRController');
        }
      }

      function getCurrentUserErrorFn(response) {
        vm.ivr_creation_failed = true;
        vm.ivr_creation_failed_messages = response.data;
        vm.ivr_creation_in_progress = false;
      }

      function IVRTemplatesAllSuccessFn(response) {
        vm.ivr_templates = response.data;
      }

      function IVRTemplatesAllErrorFn(response) {
        console.log('Error while getting message templates');
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
