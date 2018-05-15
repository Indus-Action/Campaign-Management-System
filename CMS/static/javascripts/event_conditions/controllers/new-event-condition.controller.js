(function () {
  'use strict';

  angular
    .module('vms2.event_conditions.controllers')
    .controller('NewEventConditionController', NewEventConditionController);

  NewEventConditionController.$inject = ['$cookies', '$filter', '$mdDialog', 'helpline_conditions',
                                         'Auth', 'EventConditions', 'Hooks',
                                         'IVRTemplates', 'MessageTemplates',
                                         'Stages', 'Tags', 'TaskStatus', 'TaskTypes'];

  function NewEventConditionController($cookies, $filter, $mdDialog, helpline_conditions,
                                       Auth, EventConditions, Hooks,
                                       IVRTemplates, MessageTemplates,
                                       Stages, Tags, TaskStatus, TaskTypes) {
    var vm = this;

    vm.event_condition_creation_in_progress = false;
    vm.event_creation_failed = false;
    vm.event_creation_failed_messages = [];

    vm.helpline_conditions = helpline_conditions;

    vm.authenticated_user = null;

    vm.data = {
      'params': {}
    };

    vm.selected_stage = null;
    vm.selected_tag = [];
    vm.selected_task_status = null;
    vm.selected_task_type = null;
    vm.selected_hook = null;

    vm.actions_toggler = {};
    vm.action_change_stage_stages = [];
    vm.action_add_tags_tags = [];
    vm.message_templates = [];
    vm.user_types = [];

    vm.tags = [];
    vm.available_tags = [];

    vm.search_term = '';
    vm.clearSearchTerm = function() {
      vm.search_term = '';
    };

    vm.createNewEventCondition = createNewEventCondition;
    vm.cancel = cancel;
    vm.loadUsers = loadUsers;
    vm.onSearchTextChange = onSearchTextChange;
    vm.toggleActions = toggleActions;

    activate();

    function activate() {
      Auth.getAuthenticatedUser($cookies.get('token'))
        .then(getAuthenticatedUserSuccessFn, getAuthenticatedUserErrorFn);

      EventConditions.getEventConditionTypes()
        .then(getEventConditionTypesSuccessFn, getEventConditionTypesErrorFn);

      Hooks.actions()
        .then(hookActionsAllSuccessFn, hookActionsAllErrorFn);

      MessageTemplates.all()
        .then(messageTemplatesAllSuccessFn, messageTemplatesAllErrorFn);

      IVRTemplates.all()
        .then(IVRTemplatesAllSuccessFn, IVRTemplatesAllErrorFn);

      Stages.all()
        .then(stagesAllSuccessFn, stagesAllErrorFn);

      Tags.all()
        .then(tagsAllSuccessFn, tagsAllErrorFn);

      TaskStatus.all()
        .then(taskStatusAllSuccessFn, taskStatusAllErrorFn);

      TaskTypes.all()
        .then(taskTypesAllSuccessFn, taskTypesAllErrorFn);

      if (vm.helpline_conditions) {
        vm.data.event_condition_type = 'USER';
        vm.data.event_condition_category = 'MC';
      }

      function getAuthenticatedUserSuccessFn(response) {
        vm.authenticated_user = response.data.user;

        vm.data.params['authenticated_user'] = vm.authenticated_user;
      }

      function getAuthenticatedUserErrorFn(response) {
        console.log('Error while getting authenticated user in NewEventConditionController');
      }

      function getEventConditionTypesSuccessFn(response) {
        vm.event_condition_types = response.data;
      }

      function getEventConditionTypesErrorFn(response) {
        console.log('Error while getting event condition types in NewEventConditionController');
      }

      function hookActionsAllSuccessFn(response) {
        vm.hooks = response.data.data;

        for (var hook in vm.hooks) {
          vm.actions_toggler[vm.hooks[hook].name] = false;
        }
      }

      function hookActionsAllErrorFn(response) {
        console.log('Error while getting hooks in NewEventConditionController');
      }

      function messageTemplatesAllSuccessFn(response) {
        vm.message_templates = response.data;
      }

      function messageTemplatesAllErrorFn(response) {
        console.log('Error while getting message templates in NewEventConditionController');
      }

      function IVRTemplatesAllSuccessFn(response) {
        vm.ivr_templates = response.data;
      }

      function IVRTemplatesAllErrorFn(response) {
        console.log('Error while getting IVR templates in NewEventConditionController');
      }

      function stagesAllSuccessFn(response) {
        vm.stages = response.data;
      }

      function stagesAllErrorFn(response) {
        console.log('Error while getting stages in NewEventConditionController');
      }

      function tagsAllSuccessFn(response) {
        vm.tags = response.data;
        vm.available_tags = response.data;
      }

      function tagsAllErrorFn(response) {
        console.log('Error while getting tags in NewEventConditionController');
      }

      function taskStatusAllSuccessFn(response) {
        vm.task_status = response.data;
      }

      function taskStatusAllErrorFn(response) {
        console.log('Error while getting task status in NewEventConditionController');
      }

      function taskTypesAllSuccessFn(response) {
        vm.task_types = response.data;
      }

      function taskTypesAllErrorFn(response) {
        console.log('Error while getting task types in NewEventConditionController');
      }
    }

    function createNewEventCondition() {
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

      EventConditions.create(vm.data)
        .then(eventConditionCreateSuccessFn, eventConditionCreateErrorFn);

      function eventConditionCreateSuccessFn(response) {
        vm.event_condition = response.data;

        Hooks.create(vm.selected_hook)
          .then(hookCreateSuccessFn, hookCreateErrorFn);
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
        var event_condition = response.data,
            task_status_id = event_condition.task_status,
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

    function onSearchTextChange($event) {
      $event.stopPropagation();

      vm.available_tags = $filter('filter')(vm.tags, {tag: vm.search_term});
    }

    function loadUsers() {
      Auth.getUserListByType('HL')
        .then(helplineGetSuccessFn, helplineGetErrorFn);
    }

    function loadUserTypes() {
      Auth.getUserTypes()
        .then(getUserTypesSuccessFn, getUserTypesErrorFn);
    }

    function getUserTypesSuccessFn(response) {
      vm.user_types = response.data;
    }

    function getUserTypesErrorFn(response) {
      console.log('Error while gettig user types in NewEventConditionController');
    }

    function helplineGetSuccessFn(data, status, headers, config) {
      vm.helpline_operators = data.data;
    }

    function helplineGetErrorFn(data, status, headers, config) {
      console.log('Error while getting helpline operators');
    }

    function cancel() {
      $mdDialog.cancel();
    }

    function toggleActions() {
      if (vm.selected_hook.name == 'CS') {
        vm.action_change_stage_stages = vm.stages.filter(removeSelectedStage);
      }

      if (vm.selected_hook.name == 'AT') {
        vm.action_add_tags_tags = vm.available_tags.filter(removeSelectedTags);
      }

      if (vm.selected_hook.name == 'CT') {
        vm.action_create_task_task_types = vm.task_types.filter(removeSelectedTaskType);
        vm.action_create_task_task_status = vm.task_status.filter(removeSelectedTaskStatus);
      }

      for (var action in vm.actions_toggler) {
        vm.actions_toggler[action] = (action === vm.selected_hook.name) ? true : false;
      }

      function removeSelectedStage(s) {
        return s !== vm.selected_stage;
      }

      function removeSelectedTags(t) {
        for (var i = 0; i < vm.selected_tags.length; i++) {
          if (vm.selected_tags[i] == t.id) {
            return false;
          }
        }

        return true;
      }

      function removeSelectedTaskType(t) {
        return t !== vm.selected_task_type;
      }

      function removeSelectedTaskStatus(s) {
        return s !== vm.selected_task_status;
      }
    }
  }
})();
