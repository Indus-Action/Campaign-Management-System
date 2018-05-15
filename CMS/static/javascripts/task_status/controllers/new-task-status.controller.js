(function () {
  'use strict';

  angular
    .module('vms2.task_status.controllers')
    .controller('NewTaskStatusController', NewTaskStatusController);

  NewTaskStatusController.$inject = ['$mdDialog', 'TaskStatus', 'TaskStatusCategories'];

  function NewTaskStatusController($mdDialog, TaskStatus, TaskStatusCategories) {
    var vm = this;

    vm.task_status_creation_in_progress = false;
    vm.task_status_creation_failed = false;
    vm.task_status_creation_failed_messages = [];

    vm.task_status_categories = [];

    vm.data = {};

    vm.createNewTaskStatus = createNewTaskStatus;
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

    function createNewTaskStatus() {
      TaskStatus.create(vm.data)
        .then(TaskStatusCreationSuccessFn, TaskStatusCreationErrorFn);

      vm.task_status_creation_in_progress = true;

      function TaskStatusCreationSuccessFn(data, status, headers, config) {
        vm.task_status_creation_in_progress = false;
        $mdDialog.hide(data.data);
      }

      function TaskStatusCreationErrorFn(data, status, headers, config) {
        vm.task_status_creation_failed = true;
        vm.task_status_creation_failed_messages = data.data;
        vm.task_status_creation_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
