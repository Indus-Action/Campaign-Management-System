(function () {
  'use strict';

  angular
    .module('vms2.task_types.controllers')
    .controller('NewTaskTypeController', NewTaskTypeController);

  NewTaskTypeController.$inject = ['TaskTypes', 'FeedbackTypes', 'TrainingKit', 'Forms', '$mdDialog'];

  function NewTaskTypeController(TaskTypes, FeedbackTypes, TrainingKit, Forms, $mdDialog) {
    var vm = this;

    vm.task_type_creation_in_progress = false;
    vm.task_type_creation_failed = false;
    vm.task_type_creation_failed_messages = [];

    vm.data = {};
    vm.feedback_types = [];
    vm.training_kits = [];
    vm.forms = [];

    vm.createNewTaskType = createNewTaskType;
    vm.cancel = cancel;

    activate();

    function createNewTaskType() {
      TaskTypes.create(vm.data)
        .then(TaskTypeCreationSuccessFn, TaskTypeCreationErrorFn);

      vm.task_type_creation_in_progress = true;

      function TaskTypeCreationSuccessFn(data, type, headers, config) {
        vm.task_type_creation_in_progress = false;
        $mdDialog.hide(data.data);
      }

      function TaskTypeCreationErrorFn(data, type, headers, config) {
        vm.task_type_creation_failed = true;
        vm.task_type_creation_failed_messages = data.data;
        vm.task_type_creation_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }

    function activate() {
      FeedbackTypes.all()
        .then(feedbackTypesGetSuccessFn, feedbackTypesGetErrorFn);

      TrainingKit.getAll()
        .then(TrainingKitsAllSuccessFn, TrainingKitsAllErrorFn);

      Forms.get()
        .then(FormsAllSuccessFn, FormsAllErrorFn);

      function feedbackTypesGetSuccessFn(data, status, headers, config) {
        vm.feedback_types = data.data;
      }

      function feedbackTypesGetErrorFn(data, status, headers, config) {
        console.log('Error while getting feedback types');
      }

      function TrainingKitsAllSuccessFn(data, status, headers, config) {
        vm.training_kits = data.data;
      }

      function TrainingKitsAllErrorFn(data, status, headers, config) {
        console.log('Error while getting training kits');
      }

      function FormsAllSuccessFn(data, status, headers, config) {
        vm.forms = data.data;
      }

      function FormsAllErrorFn(data, status, headers, config) {
        console.log('Error while getting forms in NewTaskTypeController');
      }
    }
  }
})();
