(function () {
  'use strict';

  angular
    .module('vms2.task_types.controllers')
    .controller('EditTaskTypeController', EditTaskTypeController);

  EditTaskTypeController.$inject = ['TaskTypes', 'FeedbackTypes', 'TrainingKit', 'Forms', '$mdDialog', 'data'];

  function EditTaskTypeController(TaskTypes, FeedbackTypes, TrainingKit, Forms, $mdDialog, data) {
    var vm = this;

    vm.task_type_edit_in_progress = false;
    vm.task_type_edit_failed = false;
    vm.task_type_edit_failed_messages = [];

    vm.data = data;
    vm.feedback_types = [];
    vm.training_kits = [];
    vm.forms = [];

    vm.editTaskType = editTaskType;
    vm.deleteTaskType = deleteTaskType;
    vm.cancel = cancel;

    activate();

    function editTaskType() {
      TaskTypes.update(vm.data)
        .then(TaskTypeEditSuccessFn, TaskTypeEditErrorFn);

      vm.task_type_edit_in_progress = true;

      function TaskTypeEditSuccessFn(data, status, headers, config) {
        vm.task_type_edit_in_progress = false;
        $mdDialog.hide(data.data);
      }

      function TaskTypeEditErrorFn(data, status, headers, config) {
        vm.task_type_edit_failed = true;
        vm.task_type_edit_failed_messages = data.data;
        vm.task_type_edit_in_progress = false;
      }
    }

    function deleteTaskType() {
      TaskTypes.remove(vm.data)
        .then(TaskTypeDeleteSuccessFn, TaskTypeDeleteErrorFn);

      vm.task_type_edit_in_progress = true;

      function TaskTypeDeleteSuccessFn(data, status, headers, config) {
        vm.task_type_edit_in_progress = false;
        $mdDialog.hide(data);
      }

      function TaskTypeDeleteErrorFn(data, status, headers, config) {
        vm.task_type_edit_failed = true;
        vm.task_type_edit_failed_messages = data.data;
        vm.task_type_edit_in_progress = false;
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
        console.log('Error while getting Feedback Types');
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
