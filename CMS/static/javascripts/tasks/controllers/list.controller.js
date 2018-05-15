(function () {
  'use strict';

  angular
    .module('vms2.tasks.controllers')
    .controller('TasksListController', TasksListController);

  TasksListController.$inject = ['Tasks', '$location'];

  function TasksListController(Tasks, $location) {
    var vm = this;

    vm.tasks = [];

    activate();

    function activate() {
      var page = $location.url(),
          index = page.indexOf('=');

      if (index > -1) {
        page = page.substr(index + 1)
        vm.page = page;
      }

      Tasks.all(vm.page)
        .then(tasksGetSuccessFn, tasksGetErrorFn);

      function tasksGetSuccessFn(data, status, headers, config) {
        vm.tasks = data.data;
      }

      function tasksGetErrorFn(data, status, headers, config) {
        console.log("Error while getting all tasks");
      }
    }
  }
})();
