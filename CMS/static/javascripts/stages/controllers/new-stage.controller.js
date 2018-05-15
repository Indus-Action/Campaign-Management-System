(function () {
  'use strict';

  angular
    .module('vms2.stages.controllers')
    .controller('NewStageController', NewStageController);

  NewStageController.$inject = ['Stages', 'TaskTypes', '$mdDialog'];

  function NewStageController(Stages, TaskTypes, $mdDialog) {
    var vm = this;

    vm.stage_creation_in_progress = false;
    vm.stage_creation_failed = false;
    vm.stage_creation_failed_messages = [];

    vm.task_types = [];

    vm.data = {};

    vm.loadTaskTypes = loadTaskTypes();

    function loadTaskTypes() {
      TaskTypes.all()
        .then(taskTypesAllSuccessFn, taskTypesAllErrorFn);
    }

    function taskTypesAllSuccessFn(data, status, headers, config) {
      vm.task_types = data.data;
    }

    function taskTypesAllErrorFn(data, status, headers, config) {
      console.log('Error while getting task types');
    }

    vm.createNewStage = function () {
      Stages.create(vm.data)
        .then(StageCreationSuccessFn, StageCreationErrorFn);

      vm.stage_creation_in_progress = true;

      function StageCreationSuccessFn(data, status, headers, config) {
        vm.stage_creation_in_progress = false;
        $mdDialog.hide(data.data);
      }

      function StageCreationErrorFn(data, status, headers, config) {
        vm.stage_creation_in_progress = false;
        vm.stage_creation_failed = true;
        vm.staeg_creation_failed_messages = [];
      }
    }
  }
})();
