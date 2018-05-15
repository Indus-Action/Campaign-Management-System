(function () {
  'use strict';

  angular
    .module('vms2.forms.controllers')
    .controller('ChangeStatusFabController', ChangeStatusFabController);

  ChangeStatusFabController.$inject = ['$mdDialog', 'task', 'Tasks', 'TaskStatus'];

  function ChangeStatusFabController($mdDialog, task, Tasks, TaskStatus) {
    var vm = this;

    vm.changeStatus = changeStatus;

    vm.selected_status = task.status;
    vm.status_change_in_progress = false;
    vm.task_status = [];

    activate();

    function activate() {
      TaskStatus.all()
        .then(TaskStatusAllSuccessFn, TaskStatusAllErrorFn);

      function TaskStatusAllSuccessFn(response) {
        vm.task_status = response.data;
      }

      function TaskStatusAllErrorFn(response) {
        console.log('Error while getting task status in ChangeStatusFabController');
      }
    }

    function changeStatus() {
      vm.status_change_in_progress = false;
      task.status = vm.selected_status.id;

      Tasks.update(task)
        .then(taskStatusChangedSuccessFn, taskStatusChangedErrorFn);

      function taskStatusChangedSuccessFn(response) {
        $mdDialog.hide(response.data);
        vm.status_change_in_progress = false;
      }

      function taskStatusChangedErrorFn(response) {
        console.log('Error while changing data in ChangeStatusFabController');
      }
    }
  }
})();
