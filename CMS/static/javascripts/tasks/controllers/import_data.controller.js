(function () {
  'use strict';

  angular
    .module('vms2.tasks.controllers')
    .controller('ImportDataController', ImportDataController);

  ImportDataController.$inject = ['$mdDialog', 'Tasks', 'TaskStatus'];

  function ImportDataController($mdDialog, Tasks, TaskStatus) {
    var vm = this;

    vm.task_status = [];
    vm.data = {};

    vm.import_data_in_progress = false;
    vm.import_data_failed = false;
    vm.import_data_failed_messages = [];

    vm.cancel = cancel;
    vm.importData = importData;

    activate();

    function activate() {
      TaskStatus.all()
        .then(taskStatusAllSuccessFn, taskStatusAllSuccessFn);

      function taskStatusAllSuccessFn(response) {
        vm.task_status = response.data;
      }

      function taskStatusAllErrorFn(response) {
        console.log('Error while getting task status in CreateBulkTasksController');
      }
    }

    function importData() {
      var fileInput = document.getElementById('fileInput'),
          file = fileInput.files[0],
          textType = /text.*/;

      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: processData
      });

      function processData(data) {
        var users_to_be_added = data.data;
        vm.data.data = [];

        for (var n in users_to_be_added) {
          if ('unique_id' in users_to_be_added[n]) {
            vm.data.data.push(users_to_be_added[n]);
          }
        }

        importDataUtil();
      }

      function importDataUtil() {
        Tasks.importData(vm.data)
          .then(importDataSuccessFn, importDataErrorFn);
      }

      function importDataSuccessFn(response) {
        console.log('Success!');
        $mdDialog.hide();
      }

      function importDataErrorFn(response) {
        console.log('Error while importing data in TasksListingController');
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
