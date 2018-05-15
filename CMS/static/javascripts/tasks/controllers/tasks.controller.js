(function () {
  'use strict';

  angular
    .module('vms2.tasks.controllers')
    .controller('TasksController', TasksController);

  TasksController.$inject = ['$scope', '$localStorage', 'Tasks', 'TaskTypes', 'TaskStatus', 'FeedbackTypes'];

  function TasksController($scope, $localStorage, Tasks, TaskTypes, TaskStatus, FeedbackTypes) {
    var vm = this;

    vm.tasks = [];
    vm.displayed_tasks = [];

    vm.task_types = {};
    vm.task_status = {};
    vm.feedback_types = {};

    activate();

    function activate() {
      if (!$localStorage.task_types) {
        TaskTypes.all()
          .then(TaskTypesAllSuccessFn, TaskTypesAllErrorFn);
      } else {
        vm.task_types = $localStorage.task_types;
      }

      if (!$localStorage.task_status) {
        TaskStatus.all()
          .then(TaskStatusAllSuccessFn, TaskStatusAllErrorFn);
      } else {
        vm.task_status = $localStorage.task_status;
      }

      if (!$localStorage.feedback_types) {
        FeedbackTypes.all()
          .then(FeedbackTypesAllSuccessFn, FeedbackTypesAllErrorFn);
      } else {
        vm.feedback_types = $localStorage.feedback_types;
      }

      $scope.$watchCollection(function () { return $scope.tasks; }, render);

      function TaskTypesAllSuccessFn(data, status, headers, config) {
        var task_types = data.data;

        for (var t in task_types) {
          vm.task_types[task_types[t].id] = task_types[t];
        }

        $localStorage.task_types = vm.task_types;
      }

      function TaskTypesAllErrorFn(data, status, headers, config) {
        console.log('Error while getting task types in TasksController');
      }

      function TaskStatusAllSuccessFn(data, status, headers, config) {
        var task_status = data.data;

        for (var t in task_status) {
          vm.task_status[task_status[t].id] = task_status[t];
        }

        $localStorage.task_status = vm.task_status;
      }

      function TaskStatusAllErrorFn(data, status, headers, config) {
        console.log('Error while getting task status in TasksController');
      }

      function FeedbackTypesAllSuccessFn(data, status, headers, config) {
        var feedback_types = data.data;

        for (var f in feedback_types) {
          vm.feedback_types[feedback_types[f].id] = feedback_types[f];
        }

        $localStorage.feedback_types = vm.feedback_types;
      }

      function FeedbackTypesAllErrorFn(data, status, headers, config) {
        console.log('Error while getting feedback types in TasksController');
      }
    }

    function render(current, original) {
      if (current != original) {
        vm.tasks = [];
        vm.displayed_tasks = [];

        for (var i = 0; i < current.length; i++) {
          vm.displayed_tasks.push(current[i]);
          vm.tasks.push(current[i]);
        }
      }
    }
  }
})();
