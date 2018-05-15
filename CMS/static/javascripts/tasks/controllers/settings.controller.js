(function () {
  'use strict';

  angular
    .module('vms2.tasks.controllers')
    .controller('TasksSettingsController', TasksSettingsController);

  TasksSettingsController.$inject = ['$scope', '$mdDialog', '$mdMedia',
                                     'TaskTypes', 'TaskStatus', 'TaskStatusCategories',
                                     'FeedbackTypes', 'Stages', 'SpaceTypes', 'Interests',
                                     'Tags', 'MessageTemplates', 'IVRTemplates'];

  function TasksSettingsController($scope, $mdDialog, $mdMedia,
                                   TaskTypes, TaskStatus, TaskStatusCategories,
                                   FeedbackTypes, Stages, SpaceTypes, Interests,
                                   Tags, MessageTemplates, IVRTemplates) {
    var vm = this;

    vm.task_types = [];
    vm.task_status = [];
    vm.task_status_categories = [];
    vm.feedback_types = [];
    vm.stages = [];
    vm.tags = [];
    vm.interests = [];
    vm.message_templates = [];
    vm.ivr_templates = [];
    vm.spaceTypes = [];

    vm.task_types_loading = true;
    vm.task_status_loading = true;
    vm.task_status_categories_loading = true;
    vm.feedback_types_loading = true;
    vm.stages_loading = true;
    vm.tags_loading = true;
    vm.message_templates_loading = true;
    vm.ivr_templates_loading = true;
    vm.space_types_loading = true;
    vm.interests_loading = true;

    vm.are_tags_read_only = true;
    vm.are_interests_read_only = true;

    vm.openNewTaskTypePopup = openNewTaskTypePopup;
    vm.openNewTaskStatusPopup = openNewTaskStatusPopup;
    vm.openNewTaskStatusCategoryPopup = openNewTaskStatusCategoryPopup;

    vm.openEditTaskTypePopup = openEditTaskTypePopup;
    vm.openEditTaskStatusPopup = openEditTaskStatusPopup;

    vm.openNewStagePopup = openNewStagePopup;
    vm.openEditStagePopup = openEditStagePopup;

    vm.openNewTagPopup = openNewTagPopup;
    vm.openEditTagPopup = openEditTagPopup;

    vm.openNewInterestPopup = openNewInterestPopup;

    activate();

    function activate() {
      TaskTypes.all()
        .then(taskTypesGetSuccessFn, taskTypesGetErrorFn);

      TaskStatus.all()
        .then(taskStatusGetSuccessFn, taskStatusGetErrorFn);

      TaskStatusCategories.all()
        .then(taskStatusCategoriesAllSuccessFn, taskStatusCategoriesAllErrorFn);

      FeedbackTypes.all()
        .then(feedbackTypesGetSuccessFn, feedbackTypesGetErrorFn);

      Stages.all()
        .then(stagesGetSuccessFn, stagesGetErrorFn);

      Tags.all()
        .then(tagsGetSuccessFn, tagsGetErrorFn);

      MessageTemplates.all()
        .then(messageTemplatesGetSuccessFn, messageTemplatesGetErrorFn);

      IVRTemplates.all()
        .then(ivrTemplatesGetSuccessFn, ivrTemplatesGetErrorFn);

      SpaceTypes.all()
        .then(spaceTypesAllSuccessFn, spaceTypesAllErrorFn);

      Interests.all()
        .then(interestsAllSuccessFn, interestsAllErrorFn);

      function tagsGetSuccessFn(response) {
        vm.tags = response.data;
        vm.tags_loading = false;
      }

      function tagsGetErrorFn(response) {
        vm.tags_loading = false;
        console.log('Error while getting tags in TasksSettingsController');
      }

      function taskTypesGetSuccessFn(response) {
        vm.task_types = response.data;
        vm.task_types_loading = false;
      }

      function taskTypesGetErrorFn(response) {
        vm.task_types_loading = false;
        console.log('Error while getting task types in TasksSettingsController');
      }

      function taskStatusGetSuccessFn(response) {
        vm.task_status = response.data;
        vm.task_status_loading = false;
      }

      function taskStatusGetErrorFn(response) {
        vm.task_status_loading = false;
        console.log('Error while getting task status');
      }

      function taskStatusCategoriesAllSuccessFn(response) {
        vm.task_status_categories = response.data;
        vm.task_status_categories_loading = false;
      }

      function taskStatusCategoriesAllErrorFn(response) {
        vm.task_status_categories_loading = false;
        console.log('Error while getting task status categories');
      }

      function feedbackTypesGetSuccessFn(response) {
        vm.feedback_types = response.data;
        vm.feedback_types_loading = false;
      }

      function feedbackTypesGetErrorFn(response) {
        vm.feedback_types_loading = false;
        console.log('Error while getting feedback types');
      }

      function stagesGetSuccessFn(response) {
        vm.stages = response.data;
        vm.stages_loading = false;
      }

      function stagesGetErrorFn(response) {
        vm.stages_loading = false;
        console.log('Error while getting stages');
      }

      function messageTemplatesGetSuccessFn(response) {
        vm.message_templates = response.data;
        vm.message_templates_loading = false;
      }

      function messageTemplatesGetErrorFn(response) {
        vm.message_templates_loading = false;
        console.log('Error while getting message templates');
      }

      function ivrTemplatesGetSuccessFn(response) {
        vm.ivr_templates = response.data;
        vm.ivr_templates_loading = false;
      }

      function ivrTemplatesGetErrorFn(response) {
        vm.ivr_templates_loading = false;
        console.log('Error while getting ivr templates');
      }

      function spaceTypesAllSuccessFn(response) {
        vm.spaceTypes = response.data;
        vm.space_types_loading = false;
      }

      function spaceTypesAllErrorFn(response) {
        vm.space_types_loading = false;
        console.log('Error while getting space types');
      }

      function interestsAllSuccessFn(response) {
        vm.interests = response.data;
        vm.interests_loading = false;
      }

      function interestsAllErrorFn(response) {
        vm.interests_loading = false;
        console.log('Error while getting interests');
      }
    }

    function openNewTaskTypePopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        controller: 'NewTaskTypeController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/task_types/new-task-type.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(task_type) {
        vm.task_types.push(task_type);
      }, function() {
        console.log("this asdasdasd");
      });

      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    }

    function openEditTaskTypePopup(task_type, index, ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {data: task_type},
        controller: 'EditTaskTypeController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/task_types/edit-task-type.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(data) {
        if (data.status == 204) {
          vm.task_types.splice(index, 1);
        } else if (data.status == 200){
          vm.task_types[index] = data.data;
        }
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function openNewTaskStatusPopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        controller: 'NewTaskStatusController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/task_status/new-task-status.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(task_status) {
        vm.task_status.push(task_status);
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function openEditTaskStatusPopup(task_status, index, ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {data: task_status},
        controller: 'EditTaskStatusController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/task_status/edit-task-status.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(data) {
        if (data.status == 204) {
          vm.task_status.splice(index, 1);
        } else if (data.status == 200) {
          vm.task_status[index] = data.data;
        }
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function openNewTaskStatusCategoryPopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        controller: 'NewTaskStatusCategoryController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/task_status_categories/new-task-status-category.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(task_status_category) {
        vm.task_status.push(task_status);
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function openNewTaskStatusPopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        controller: 'NewTaskStatusController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/task_status/new-task-status.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(task_status) {
        vm.task_status.push(task_status);
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function openEditTaskStatusPopup(task_status, index, ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {data: task_status},
        controller: 'EditTaskStatusController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/task_status/edit-task-status.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(data) {
        if (data.status == 204) {
          vm.task_status.splice(index, 1);
        } else if (data.status == 200) {
          vm.task_status[index] = data.data;
        }
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function openNewStagePopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        controller: 'NewStageController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/stages/new-stage.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(stage) {
        vm.stages.push(stage);
      }, function() {
        console.log("this asdasdasd");
      });

      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    }

    function openEditStagePopup(stage, index, ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {data: stage},
        controller: 'EditStageController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/stages/edit-stage.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(data) {
        if (data.status == 204) {
          vm.stages.splice(index, 1);
        } else if (data.status == 200) {
          vm.stages[index] = data.data;
        }
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function openNewTagPopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        controller: 'NewTagController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/tags/new-tag.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(tag) {
        vm.tags.push(tag);
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function openEditTagPopup(tag, index, ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {data: tag},
        controller: 'EditTagController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/tags/edit-tag.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(data) {
        if (data.status == 204) {
          vm.tags.splice(index, 1);
        } else if (data.status == 200) {
          vm.tags[index] = data.data;
        }
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function openNewInterestPopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        controller: 'NewInterestController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/interests/new-interest.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(interest) {
        vm.interests.push(interest);
      }, function() {
        console.log("this asdasdasd");
      });
    }
  }
})();
