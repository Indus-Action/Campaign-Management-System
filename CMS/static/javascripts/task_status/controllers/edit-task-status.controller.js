(function () {
  'use strict';

  angular
    .module('vms2.task_status.controllers')
    .controller('EditTaskStatusController', EditTaskStatusController);

  EditTaskStatusController.$inject = ['$mdDialog', 'data', 'TaskStatus', 'TaskStatusCategories'];

  function EditTaskStatusController($mdDialog, data, TaskStatus, TaskStatusCategories) {
    var vm = this;

    vm.task_status_edit_in_progress = false;
    vm.task_status_edit_failed = false;
    vm.task_status_edit_failed_messages = [];

    vm.task_status_categories = [];

    vm.data = data;

    vm.editTaskStatus = editTaskStatus;
    vm.deleteTaskStatus = deleteTaskStatus;
    vm.cancel = cancel;

    activate();

    function activate() {
      TaskStatusCategories.all()
        .then(TaskStatusCategoriesAllSuccessFn, TaskStatusCategoriesAllErrorFn);

      function TaskStatusCategoriesAllSuccessFn(response) {
        vm.task_status_categories = response.data;
      }

      function TaskStatusCategoriesAllErrorFn(response) {
        console.log('Error while getting task status categories in NewTaskStatusController');
      }
    }

    function editTaskStatus() {
      TaskStatus.update(vm.data)
        .then(TaskStatusEditSuccessFn, TaskStatusEditErrorFn);

      vm.task_status_edit_in_progress = true;

      function TaskStatusEditSuccessFn(data, status, headers, config) {
        vm.task_status_edit_in_progress = false;
        $mdDialog.hide(data);
      }

      function TaskStatusEditErrorFn(data, status, headers, config) {
        vm.task_status_edit_failed = true;
        vm.task_status_edit_failed_messages = data.data;
        vm.task_status_edit_in_progress = false;
      }
    }

    function deleteTaskStatus() {
      TaskStatus.remove(vm.data)
        .then(TaskStatusDeleteSuccessFn, TaskStatusDeleteErrorFn);

      vm.task_status_edit_in_progress = true;

      function TaskStatusDeleteSuccessFn(data, status, headers, config) {
        vm.task_status_edit_in_progress = false;
        $mdDialog.hide(data);
      }

      function TaskStatusDeleteErrorFn(data, status, headers, config) {
        vm.task_status_edit_failed = true;
        vm.task_status_edit_failed_messages = data.data;
        vm.task_status_edit_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
