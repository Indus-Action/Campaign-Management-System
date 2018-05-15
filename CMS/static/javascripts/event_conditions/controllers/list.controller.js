(function () {
  'use strict';

  angular
    .module('vms2.event_conditions.controllers')
    .controller('EventConditionsListController', EventConditionsListController);

  EventConditionsListController.$inject = ['$localStorage', '$mdDialog', '$mdMedia', '$scope',
                                           'EventConditions', 'Hooks', 'Stages',
                                           'Tags', 'TaskStatus', 'TaskTypes'];

  function EventConditionsListController($localStorage, $mdDialog, $mdMedia, $scope,
                                         EventConditions, Hooks, Stages,
                                         Tags, TaskStatus, TaskTypes) {
    var vm = this,
        event_condition = $scope.event_condition;

    vm.event_conditions = [];
    vm.task_status = [];
    vm.stages = [];
    vm.task_types = [];
    vm.tags = [];
    vm.are_tags_read_only = true;

    vm.openNewEventConditionPopup = openNewEventConditionPopup;
    vm.openEditEventConditionPopup = openEditEventConditionPopup;

    activate();

    function activate() {
      EventConditions.allNormal()
        .then(eventConditionsAllSuccessFn, eventConditionsAllErrorFn);

      Stages.all()
        .then(stagesAllSuccessFn, stagesAllErrorFn);

      Tags.all()
        .then(tagsAllSuccessFn, tagsAllErrorFn);

      TaskStatus.all()
        .then(taskStatusAllSuccessFn, taskStatusAllErrorFn);

      TaskTypes.all()
        .then(taskTypesAllSuccessFn, taskTypesAllErrorFn);

      Hooks.actions()
        .then(hookActionsGetSuccessFn, hookActionsGetErrorFn);

      Hooks.all()
        .then(hooksAllSuccessFn, hooksAllErrorFn);

      Hooks.allActions()
        .then(actionsAllSuccessFn, actionsAllErrorFn);

      function actionsAllSuccessFn(response) {
        $localStorage.all_system_actions = response.data;
      }

      function actionsAllErrorFn(response) {
        console.log('Error while getting all actions');
      }

      function hooksAllSuccessFn(response) {
        $localStorage.system_hooks = response.data;
      }

      function hooksAllErrorFn(response) {
        console.log('Error while getting hooks');
      }

      function hookActionsGetSuccessFn(response) {
        vm.hooks = response.data;
        $localStorage.system_actions = response.data.data;
      }

      function hookActionsGetErrorFn(response) {
        console.log('Error while getting hooks in EventConditionsListController');
      }

      function stagesAllSuccessFn(response) {
        vm.stages = response.data;
        $localStorage.system_stages = vm.stages;
      }

      function stagesAllErrorFn(response) {
        console.log('Error while getting stages in EventConditionsListController');
      }

      function tagsAllSuccessFn(response) {
        vm.tags = response.data;
        $localStorage.system_tags = vm.tags;
      }

      function tagsAllErrorFn(response) {
        console.log('Error while getting tags in EventConditionsListController');
      }

      function taskStatusAllSuccessFn(response) {
        vm.task_status = response.data;
        $localStorage.system_task_status = response.data;
      }

      function taskStatusAllErrorFn(response) {
        console.log('Error while getting task status in EventConditionsListController');
      }

      function taskTypesAllSuccessFn(response) {
        vm.task_types = response.data;
        $localStorage.system_task_types = response.data;
      }

      function taskTypesAllErrorFn(response) {
        console.log('Error while getting task types in EventConditionsListController');
      }
    }

    function eventConditionsAllSuccessFn(response) {
      vm.event_conditions = response.data;

      for (var e in vm.event_conditions) {
        var task_status_id = vm.event_conditions[e].task_status,
            task_type_id = vm.event_conditions[e].task_type,
            stage_id = vm.event_conditions[e].stage,
            hook_id = vm.event_conditions[e].hook;

        for (var t in vm.event_conditions[e].event_tags) {
          var id = vm.event_conditions[e].event_tags[t];

          vm.event_conditions[e].event_tags[t] = Tags.getTagFromLocalStorage(id);
        }
        vm.event_conditions[e].task_status = TaskStatus.getTaskStatusFromLocalStorage(task_status_id);
        vm.event_conditions[e].task_type = TaskTypes.getTaskTypeFromLocalStorage(task_type_id);
        vm.event_conditions[e].stage = Stages.getStageFromLocalStorage(stage_id);
        vm.event_conditions[e].action = Hooks.getActionFromLocalStorage(hook_id);
      }
    }

    function eventConditionsAllErrorFn(response) {
      console.log('Error while gettin event conditions');
    }

    function openNewEventConditionPopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {
          helpline_conditions: false
        },
        controller: 'NewEventConditionController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/event_conditions/new-event-condition.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(condition) {
        vm.event_conditions.push(condition)
      }, function() {
        console.log("this asdasdasd");
      });

      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    }

    function openEditEventConditionPopup(event_condition, ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {data: event_condition},
        controller: 'EditEventConditionController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/event_conditions/edit-event-condition.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(condition) {
        EventConditions.all()
          .then(eventConditionsAllSuccessFn, eventConditionsAllErrorFn);
      }, function() {
        console.log("this asdasdasd");
      });
    }
  }
})();
