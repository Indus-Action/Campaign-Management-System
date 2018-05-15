(function () {
  'use strict';

  angular
    .module('vms2.task_status_categories.controllers')
    .controller('NewTaskStatusCategoryController', NewTaskStatusCategoryController);

  NewTaskStatusCategoryController.$inject = ['$cookies', '$mdDialog', '$routeParams', 'Auth', 'TaskStatusCategories'];

  function NewTaskStatusCategoryController($cookies, $mdDialog, $routeParams, Auth, TaskStatusCategories) {
    var vm = this;

    vm.task_status_category_creation_in_progress = false;
    vm.task_status_category_creation_failed = false;
    vm.task_status_category_creation_failed_messages = [];

    vm.task_completed_flag_choices = {};

    vm.data = {};

    vm.createNewTaskStatusCategory = createNewTaskStatusCategory;
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

    function createNewTaskStatusCategory() {
      vm.task_status_category_creation_in_progress = true;

      TaskStatusCategories.create(vm.data)
        .then(TaskStatusCategoryCreationSuccessFn, TaskStatusCategoryCreationErrorFn);

      function TaskStatusCategoryCreationSuccessFn(data, status, headers, config) {
        vm.task_status_category_creation_in_progress = false;
        $mdDialog.hide(data.data);
      }

      function TaskStatusCategoryCreationErrorFn(data, status, headers, config) {
        vm.task_status_category_creation_failed = true;
        vm.task_status_category_creation_failed_messages = data.data;
        vm.task_status_category_creation_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
