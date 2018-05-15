(function () {
  'use strict';

  angular
    .module('vms2.tasks.controllers')
    .controller('CreateBulkTasksController', CreateBulkTasksController);

  CreateBulkTasksController.$inject = ['$mdDialog', 'Auth', 'Tasks', 'TaskStatus', 'TaskTypes'];

  function CreateBulkTasksController($mdDialog, Auth, Tasks, TaskStatus, TaskTypes) {
    var vm = this;

    vm.data = {};

    vm.task_types = [];
    vm.task_status = [];

    vm.create_bulk_tasks_in_progress = false;
    vm.create_bulk_tasks_failed = false;
    vm.create_bulk_tasks_failed_messages = [];
    vm.empty_tasks = false;

    vm.random_assign = false;

    vm.cancel = cancel;
    vm.createBulkTasks = createBulkTasks;

    activate();

    function activate() {
      TaskTypes.all()
        .then(taskTypesAllSuccessFn, taskTypesAllErrorFn);

      TaskStatus.all()
        .then(taskStatusAllSuccessFn, taskStatusAllSuccessFn);

      Auth.getUserTypes().
        then(getUserTypesSuccess, getUserTypesFailure);

      function getUserTypesSuccess(response) {
        vm.user_types = response.data;
      }

      function getUserTypesFailure() {
        $scope.loading = false;
        console.log("Failed to retrieve user types.");
      }

      function taskTypesAllSuccessFn(response) {
        vm.task_types = response.data;
      }

      function taskTypesAllErrorFn(response) {
        console.log('Error while getting task types in CreateBulkTasksController');
      }

      function taskStatusAllSuccessFn(response) {
        vm.task_status = response.data;
      }

      function taskStatusAllErrorFn(response) {
        console.log('Error while getting task status in CreateBulkTasksController');
      }
    }

    function processUsers(users) {
      var users_to_be_added = users.data,
          regex = "^([0|\+[0-9]{2})?([7-9][0-9]{9})$",
          mobile_regex = new RegExp(regex);

      vm.data.users = [];

      for (var n in users_to_be_added){
        if (mobile_regex.test(users_to_be_added[n].mobile.toString().trim())) {
          vm.data.users.push(users_to_be_added[n].mobile.toString().trim());
        }
      }

      createBulkTasksUtil();
    }

    function addUsersToList() {
      var fileInput = document.getElementById('fileInput'),
          file = fileInput.files[0],
          textType = /text.*/;

      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: processUsers
      });
    }

    function createBulkTasksUtil() {
      Tasks.createBulkTasks(vm.data)
        .then(createBulkTasksSuccessFn, createBulkTasksErrorFn);

      vm.create_bulk_tasks_in_progress = true;

      function createBulkTasksSuccessFn(response) {
        vm.create_bulk_tasks_in_progress = false;
        $mdDialog.hide(response.data);
      }

      function createBulkTasksErrorFn(response) {
        vm.create_bulk_tasks_in_progress = false;
        vm.create_bulk_tasks_failed = true;
        vm.create_bulk_tasks_failed_messages = response.data;
      }
    }

    function createBulkTasks() {
      if (!vm.empty_tasks) {
        addUsersToList();
      } else {
        createBulkTasksUtil();
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
