(function () {
  'use strict';

  angular
    .module('vms2.event_conditions.controllers')
    .controller('HelplineConditionsListController', HelplineConditionsListController);

  HelplineConditionsListController.$inject = ['$localStorage', '$mdDialog', '$mdMedia', '$scope',
                                              'EventConditions', 'Exotel', 'Hooks', 'Stages', 'Tags',
                                              'TaskStatus', 'TaskTypes'];

  function HelplineConditionsListController($localStorage, $mdDialog, $mdMedia, $scope,
                                            EventConditions, Exotel, Hooks, Stages, Tags,
                                            TaskStatus, TaskTypes) {
    var vm = this,
        event_condition = $scope.event_condition;

    vm.event_conditions = [];
    vm.stages = [];
    vm.tags = [];
    vm.are_tags_read_only = true;

    vm.exotel_update_in_progress = false;
    vm.exotel_update_failed = false;
    vm.exotel_update_failed_messages = [];
    vm.exotel = {};

    vm.openNewEventConditionPopup = openNewEventConditionPopup;
    vm.openEditEventConditionPopup = openEditEventConditionPopup;
    vm.saveExotelDetails = saveExotelDetails;

    activate();

    function activate() {
      EventConditions.allHelpline()
        .then(eventConditionsAllSuccessFn, eventConditionsAllErrorFn);

      Exotel.all()
        .then(exotelGetSuccessFn, exotelGetErrorFn);

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

      function exotelGetSuccessFn(response) {
        if (response.data.length > 0) {
          vm.exotel = response.data[0];
        } else {
          Exotel.create(vm.exotel)
            .then(exotelCreateSuccessFn, exotelCreateErrorFn);
        }

        function exotelCreateSuccessFn(response) {
          vm.exotel = response.data;
        }

        function exotelCreateErrorFn(response) {
          console.log('Error while creating exotel in HelplineEventConditionsListController');
        }
      }

      function exotelGetErrorFn(response) {
          console.log('Error while getting exotel in HelplineEventConditionsListController');
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
      }

      function taskStatusAllErrorFn(response) {
        console.log('Error while getting task status in EventConditionsListController');
      }

      function taskTypesAllSuccessFn(response) {
        vm.task_types = response.data;
      }

      function taskTypesAllErrorFn(response) {
        console.log('Error while getting task types in EventConditionsListController');
      }
    }

    function eventConditionsAllSuccessFn(response) {
      vm.event_conditions = response.data;

      for (var e in vm.event_conditions) {
        var stage_id = vm.event_conditions[e].stage,
            hook_id = vm.event_conditions[e].hook;

        for (var t in vm.event_conditions[e].event_tags) {
          var id = vm.event_conditions[e].event_tags[t];

          vm.event_conditions[e].event_tags[t] = Tags.getTagFromLocalStorage(id);
        }

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
          helpline_conditions: true
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

    function saveExotelDetails() {
      Exotel.update(vm.exotel)
        .then(exotelUpdateSuccessFn, exotelUpdateErrorFn);

      vm.exotel_update_in_progress = true;

      function exotelUpdateSuccessFn(response) {
        vm.exotel_update_in_progress = false;
      }

      function exotelUpdateErrorFn(response) {
        vm.exotel_update_in_progress = false;
        vm.exotel_update_failed_messages = response.data;
        vm.exotel_update_failed = true;
      }
    }
  }
})();
