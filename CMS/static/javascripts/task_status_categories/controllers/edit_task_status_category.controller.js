(function () {
  'use strict';

  angular
    .module('vms2.task_status_categories.controllers')
    .controller('EditTaskStatusCategoryController', EditTaskStatusCategoryController);

  EditTaskStatusCategoryController.$inject = ['$mdDialog', 'data', 'TaskStatusCategories'];

  function EditTaskStatusCategoryController($mdDialog, data, TaskStatusCategories) {
    var vm = this;

    vm.task_status_category_edit_in_progress = false;
    vm.task_status_category_edit_failed = false;
    vm.task_status_category_edit_failed_messages = [];

    vm.task_completed_flag_choices = {};

    vm.data = data;

    vm.editTaskStatusCategory = editTaskStatusCategory;
    vm.deleteTaskStatusCategory = deleteTaskStatusCategory;
    vm.cancel = cancel;

    activate();

    function activate() {
      TaskStatusCategories.getTaskCompletedFlagChoices()
        .then(getFlagChoicesSuccessFn, getFlagChoicesErrorFn);

      function getFlagChoicesSuccessFn(response) {
        vm.task_completed_flag_choices = response.data;
      }

      function getFlagChoicesErrorFn(response) {
        console.log('Error while getting flag choices in NewTaskStatusCategoryController');
      }
    }

    function editTaskStatusCategory() {
      TaskStatusCategories.update(vm.data)
        .then(TaskStatusCategoryEditSuccessFn, TaskStatusCategoryEditErrorFn);

      vm.task_status_category_edit_in_progress = true;

      function TaskStatusCategoryEditSuccessFn(data, status, headers, config) {
        vm.task_status_category_edit_in_progress = false;
        $mdDialog.hide(data);
      }

      function TaskStatusCategoryEditErrorFn(data, status, headers, config) {
        vm.task_status_category_edit_failed = true;
        vm.task_status_category_edit_failed_messages = data.data;
        vm.task_status_category_edit_in_progress = false;
      }
    }

    function deleteTaskStatusCategory() {
      TaskStatusCategories.remove(vm.data)
        .then(TaskStatusCategoryDeleteSuccessFn, TaskStatusCategoryDeleteErrorFn);

      vm.task_status_category_edit_in_progress = true;

      function TaskStatusCategoryDeleteSuccessFn(data, status, headers, config) {
        vm.task_status_category_edit_in_progress = false;
        $mdDialog.hide(data);
      }

      function TaskStatusCategoryDeleteErrorFn(data, status, headers, config) {
        vm.task_status_category_edit_failed = true;
        vm.task_status_category_edit_failed_messages = data.data;
        vm.task_status_category_edit_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
