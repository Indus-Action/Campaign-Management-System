(function () {
  'use strict';

  angular
    .module('vms2.tasks.controllers')
    .controller('NewTaskController', NewTaskController);

  NewTaskController.$inject = ['$location', 'Auth', 'Tasks', 'TaskTypes', 'TaskStatus', 'FeedbackTypes'];

  function NewTaskController($location, Auth, Tasks, TaskTypes, TaskStatus, FeedbackTypes) {
    var vm = this;

    vm.data = {};
    vm.helpline_operators = [];
    vm.beneficiaries = [];
    vm.task_types = [];
    vm.task_status = [];

    vm.task_creation_in_progress = false;
    vm.task_creation_failed = false;
    vm.task_creation_failed_messages = [];

    vm.submit = submit;
    vm.no_cache = true;

    vm.beneficiarySearchTextChange = beneficiarySearchTextChange;
    vm.loadUsers = loadUsers;
    vm.loadTaskTypes = loadTaskTypes;
    vm.loadTaskStatus = loadTaskStatus;

    activate();

    function activate() {
      Auth.all()
        .then(usersGetSuccessFn, usersGetErrorFn);
    }

    function usersGetSuccessFn(data, status, headers, config) {
      vm.users = data.data;
    }

    function usersGetErrorFn(data, status, headers, config) {
      vm.users = data.data;
    }

    function beneficiarySearchTextChange(search_text) {
      if (search_text.length > 4) {
        Auth.getUserByMobile(search_text)
          .then(beneficiaryGetSuccessFn, beneficiaryGetErrorFn);
      }
    }

    function beneficiaryGetSuccessFn(data, status, headers, config) {
      var users = data.data;

      vm.beneficiaries = users.map(function (user) {
        return {
          value: user.user,
          display: user.mobile + ' | ' + user.user.first_name + ' ' + user.user.last_name
        };
      });
    }

    function beneficiaryGetErrorFn(data, status, headers, config) {
      console.log("Error while getting beneficiaries");
    }

    function loadUsers() {
      Auth.getUserListByType('HL')
        .then(helplineGetSuccessFn, helplineGetErrorFn);
    }

    function loadTaskTypes() {
      TaskTypes.all()
        .then(taskTypesGetSuccessFn, taskTypesGetErrorFn);
    }

    function loadTaskStatus() {
      TaskStatus.all()
        .then(taskStatusGetSuccessFn, taskStatusGetErrorFn);
    }

    function helplineGetSuccessFn(data, status, headers, config) {
      vm.helpline_operators = data.data;
    }

    function helplineGetErrorFn(data, status, headers, config) {
      console.log('Error while getting helpline operators');
    }

    function taskTypesGetSuccessFn(data, status, headers, config) {
      vm.task_types = data.data;
    }

    function taskTypesGetErrorFn(data, status, headers, config) {
      console.log('Error while getting task types');
    }

    function taskStatusGetSuccessFn(data, status, headers, config) {
      vm.task_status = data.data;
    }

    function taskStatusGetErrorFn(data, status, headers, config) {
      console.log('Error while getting task status');
    }

    function submit() {


      Tasks.create(vm.data)
        .then(taskCreateSuccessFn, taskCreateFailureFn);

      vm.task_creation_in_progress = true;

      function taskCreateSuccessFn(data, status, headers, config) {
        console.log("task created successfully", data.data);
        vm.task_creation_in_progress = false;
        $location.url('/tasks/list');
      }

      function taskCreateFailureFn(data, status, headers, config) {
        vm.task_creation_failed = true;
        vm.task_creation_failed_messages = data.data;
        vm.task_creation_in_progress = false;
      }
    }
  }
})();
