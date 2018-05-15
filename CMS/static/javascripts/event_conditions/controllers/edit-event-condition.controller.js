(function () {
  'use strict';

  angular
    .module('vms2.event_conditions.controllers')
    .controller('EditEventConditionController', EditEventConditionController);

  EditEventConditionController.$inject = ['$mdDialog', 'data', 'EventConditions', 'Hooks', 'Stages',
                                         'Tags', 'TaskStatus', 'TaskTypes'];

  function EditEventConditionController($mdDialog, data, EventConditions, Hooks, Stages, Tags,
                                       TaskStatus, TaskTypes) {
    var vm = this;

    vm.event_condition_edit_in_progress = false;
    vm.event_edit_failed = false;
    vm.event_edit_failed_messages = [];

    vm.data = data;

    vm.selected_stage = null;
    vm.selected_tag = [];
    vm.selected_task_status = null;
    vm.selected_task_type = null;
    vm.selected_hook = null;

    vm.tags = [];
    vm.available_tags = [];

    vm.search_term = '';
    vm.clearSearchTerm = function() {
      vm.search_term = '';
    };

    vm.editEventCondition = editEventCondition;
    vm.deleteEventCondition = deleteEventCondition;
    vm.cancel = cancel;
    vm.onSearchTextChange = onSearchTextChange;

    activate();

    function activate() {
      Hooks.actions()
        .then(hookActionsAllSuccessFn, hookActionsAllErrorFn);

      Stages.all()
        .then(stagesAllSuccessFn, stagesAllErrorFn);

      Tags.all()
        .then(tagsAllSuccessFn, tagsAllErrorFn);

      TaskStatus.all()
        .then(taskStatusAllSuccessFn, taskStatusAllErrorFn);

      TaskTypes.all()
        .then(taskTypesAllSuccessFn, taskTypesAllErrorFn);

      function hookActionsAllSuccessFn(response) {
        vm.hooks = response.data.data;
      }

      function hookActionsAllErrorFn(response) {
        console.log('Error while getting hooks in EditEventConditionController');
      }

      function stagesAllSuccessFn(response) {
        vm.stages = response.data;
      }

      function stagesAllErrorFn(response) {
        console.log('Error while getting stages in EditEventConditionController');
      }

      function tagsAllSuccessFn(response) {
        vm.tags = response.data;
        vm.available_tags = response.data;
      }

      function tagsAllErrorFn(response) {
        console.log('Error while getting tags in EditEventConditionController');
      }

      function taskStatusAllSuccessFn(response) {
        vm.task_status = response.data;
      }

      function taskStatusAllErrorFn(response) {
        console.log('Error while getting task status in EditEventConditionController');
      }

      function taskTypesAllSuccessFn(response) {
        vm.task_types = response.data;
      }

      function taskTypesAllErrorFn(response) {
        console.log('Error while getting task types in EditEventConditionController');
      }
    }

    function editEventCondition() {
      if (vm.selected_task_status) {
        vm.data.task_status = vm.selected_task_status.id;
      }

      if (vm.selected_task_type) {
        vm.data.task_type = vm.selected_task_type.id;
      }

      if (vm.selected_tags) {
        vm.data.event_tags = vm.selected_tags;
      }

      if (vm.selected_stage) {
        vm.data.stage = vm.selected_stage.id;
      }

      EventConditions.update(vm.data)
        .then(eventConditionCreateSuccessFn, eventConditionCreateErrorFn);

      function eventConditionCreateSuccessFn(response) {
        vm.event_condition = response.data;

        if (Hooks.getActionFromLocalStorage(vm.event_condition.hook) !== vm.selected_hook.name) {
          Hooks.create(vm.selected_hook)
            .then(hookCreateSuccessFn, hookCreateErrorFn);
        }
      }

      function eventConditionCreateErrorFn(response) {
        console.log('Error while creating event condition');
      }

      function hookCreateSuccessFn(response) {
        vm.event_condition.hook = response.data.id;

        EventConditions.update(vm.event_condition)
          .then(eventConditionUpdateSuccessFn, eventConditionUpdateErrorFn);
      }

      function hookCreateErrorFn(response) {
        console.log('Error while create hook');
      }

      function eventConditionUpdateSuccessFn(response) {
        var event_condition = response.data;

        var task_status_id = event_condition.task_status,
            task_type_id = event_condition.task_type,
            stage_id = event_condition.stage,
            hook_id = event_condition.hook;

        for (var t in event_condition.event_tags) {
          var id = event_condition.event_tags[t];

          event_condition.event_tags[t] = Tags.getTagFromLocalStorage(id);
        }
        event_condition.task_status = TaskStatus.getTaskStatusFromLocalStorage(task_status_id);
        event_condition.task_type = TaskTypes.getTaskTypeFromLocalStorage(task_type_id);
        event_condition.stage = Stages.getStageFromLocalStorage(stage_id);
        event_condition.action = Hooks.getActionFromLocalStorage(hook_id);

        $mdDialog.hide(event_condition);
      }

      function eventConditionUpdateErrorFn(response) {
        console.log('Error while hooking the event with action');
      }
    }

    function deleteEventCondition() {
      EventConditions.remove(vm.data.id)
        .then(eventConditionDeleteSuccessFn, eventConditionDeleteErrorFn);

      vm.event_condition_edit_in_progress = true;

      function eventConditionDeleteSuccessFn(response) {
        $mdDialog.hide(data);
        vm.event_condition_edit_in_progress = false;
      }

      function eventConditionDeleteErrorFn(response) {
        vm.event_condition_edit_in_progress = false;
        vm.event_edit_failed = true;
        vm.event_edit_failed_messages = response.data;
      }
    }

    function onSearchTextChange($event) {
      $event.stopPropagation();

      vm.available_tags = $filter('filter')(vm.tags, {tag: vm.search_term});
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
