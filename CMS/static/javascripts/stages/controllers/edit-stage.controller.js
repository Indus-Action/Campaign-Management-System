(function () {
  angular
    .module('vms2.stages.controllers')
    .controller('EditStageController', EditStageController);

  EditStageController.$inject = ['Stages', 'TaskTypes', '$mdDialog', 'data'];

  function EditStageController(Stages, TaskTypes, $mdDialog, data) {
    var vm = this;

    vm.stage_edit_in_progress = false;
    vm.stage_edit_failed = false;
    vm.stage_edit_failed_messages = [];

    vm.data = data;
    vm.task_types = [];

    vm.loadTaskTypes = loadTaskTypes;
    vm.editStage = editStage;
    vm.deleteStage = deleteStage;
    vm.cancel = cancel;

    activate();

    function activate() {
      if (vm.data.task_type && typeof(vm.data.task_type) === typeof(0)) {
        TaskTypes.get(vm.data.task_type)
          .then(taskTypeGetSuccessFn, taskTypeGetErrorFn);
      }

      function taskTypeGetSuccessFn(data, status, headers, config) {
        vm.data.task_type = data.data;
      }

      function taskTypeGetErrorFn(data, status, headers, config) {
        console.log('Error while getting the associated task type of the stage');
      }
    }

    function loadTaskTypes() {
      TaskTypes.all()
        .then(taskTypesGetSuccessFn, taskTypesGetErrorFn);

      function taskTypesGetSuccessFn(data, status, headers, config) {
        vm.task_types = data.data;
      }

      function taskTypesGetErrorFn(data, status, headers, config) {
        console.log('Error while getting task types');
      }
    }

    function editStage() {
      Stages.update(vm.data)
        .then(StageEditSuccessFn, StageEditErrorFn);

      vm.stage_edit_in_progress = true;

      function StageEditSuccessFn(data, status, headers, config) {
        vm.stage_edit_in_progress = false;
        $mdDialog.hide(data.data);
      }

      function StageEditErrorFn(data, status, headers, config) {
        vm.stage_edit_failed = true;
        vm.stage_edit_failed_messages = data.data;
        vm.stage_edit_in_progress = false;
      }
    }

    function deleteStage() {
      Stages.remove(vm.data)
        .then(StageDeleteSuccessFn, StageDeleteErrorFn);

      vm.stage_edit_in_progress = true;

      function StageDeleteSuccessFn(data, status, headers, config) {
        vm.stage_edit_in_progress = false;
        $mdDialog.hide(data);
      }

      function StageDeleteErrorFn(data, status, headers, config) {
        vm.stage_edit_failed = true;
        vm.stage_edit_failed_messages = data.data;
        vm.stage_edit_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
