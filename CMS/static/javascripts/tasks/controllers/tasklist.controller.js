(function () {
  'use strict';

  angular
    .module('vms2.tasks.controllers')
    .controller('TasksListingController', TasksListingController);

  TasksListingController.$inject = ['$cookies', '$filter', '$localStorage', '$location', '$mdDialog', '$mdMedia', '$scope',
                                    'Auth', 'Calls', 'Guilds', 'Stages', 'Tags', 'Tasks',
                                    'TaskStatus', 'TaskStatusCategories',
                                    'TaskTypes'];

  function TasksListingController($cookies, $filter, $localStorage, $location, $mdDialog, $mdMedia, $scope,
                                  Auth, Calls, Guilds, Stages, Tags, Tasks, TaskStatus,
                                  TaskStatusCategories, TaskTypes) {
    var vm = this;

    vm.loading = false;
    vm.tasks = [];
    vm.displayed_tasks = [];
    vm.selected_tasks = [];
    vm.selected_helpline_operators = [];
    vm.selected_volunteers = [];
    vm.selected_assignee = [];
    vm.selected_guilds = [];
    vm.selected_stages = [];
    vm.selected_task_status = [];
    vm.selected_task_status_categories =[];
    vm.selected_task_types = [];
    vm.selected_tags = [];
    vm.users = vm.available_users = [];
    vm.search_helpline_operator_term = '';
    vm.search_volunteer_term = '';
    vm.search_assignee_term = '';
    vm.search_guild_term = '';
    vm.search_mobile = '';
    vm.filter_string = '';
    vm.authenticated_user = '';
    vm.tasks_length = 0;
    vm.page_size = 0;
    vm.guild = -1;

    vm.data = [];

    vm.assignment_in_progress = false;
    vm.update_filter_in_progress = false;
    vm.filter_applied = false;

    vm.filters = {
      'toggle_own_tasks_filter': {
        'is_enabled': false,
        'filter_string': 'assignee__in',
        'filter_value': ''
      },
      'toggle_my_guild_filter': {
        'is_enabled': false,
        'filter_string': 'assignee__profile__guild__in',
        'filter_value': ''
      },
      'toggle_beneficiary_filter': {
        'is_enabled': false,
        'filter_string': 'beneficiary__profile__mobile__in',
        'filter_value': ''
      },
      'toggle_due_today_filter': {
        'is_enabled': false,
        'filter_string': 'due_date',
        'filter_value': ''
      },
      'toggle_past_due_date_filter': {
        'is_enabled': false,
        'filter_string': 'due_date__lt',
        'filter_value': ''
      },
      'toggle_assignee_filter': {
        'is_enabled': false,
        'filter_string': 'assignee__in',
        'filter_value': ''
      },
      'toggle_stage_filter': {
        'is_enabled': false,
        'filter_string': 'beneficiary__profile__stage__in',
        'filter_value': ''
      },
      'toggle_task_status_filter': {
        'is_enabled': false,
        'filter_string': 'status__in',
        'filter_value': ''
      },
      'toggle_task_status_category_filter': {
        'is_enabled': false,
        'filter_string': 'status__category__in',
        'filter_value': ''
      },
      'toggle_task_type_filter': {
        'is_enabled': false,
        'filter_string': 'task_type__in',
        'filter_value': ''
      },
      'toggle_tag_filter': {
        'is_enabled': false,
        'filter_string': 'beneficiary__tags__in',
        'filter_value': ''
      }
    };

    vm.is_fab_open = false;

    vm.show_assignment_options = false;

    vm.showMyTasks = false;

    vm.openAddTagPopup=openAddTagPopup;
    vm.openChangeStatusPopup = openChangeStatusPopup;
    vm.openChangeStagePopup=openChangeStagePopup;
    vm.openNewMessagePopup = openNewMessagePopup;
    vm.clearFilters = clearFilters;
    vm.startCall = startCall;
    vm.toggleAssign = toggleAssign;
    vm.updateFilters = updateFilters;

    vm.is_admin = Auth.isAdmin();
    vm.assignee = Auth.getUserFromLocal();

    vm.getAllTasks = getAllTasks;

    vm.changePage = changePage;
    vm.clearHelplineOperatorsSearchTerm = clearHelplineOperatorsSearchTerm;
    vm.clearVolunteersSearchTerm = clearVolunteersSearchTerm;
    vm.clearAssigneeSearchTerm = clearAssigneeSearchTerm;
    vm.clearGuildSearchTerm = clearGuildSearchTerm;
    vm.clearStageSearchTerm = clearStageSearchTerm;
    vm.clearTaskStatusSearchTerm = clearTaskStatusSearchTerm;
    vm.clearTaskStatusCategorySearchTerm = clearTaskStatusCategorySearchTerm;
    vm.clearTaskTypeSearchTerm = clearTaskTypeSearchTerm;
    vm.clearTagSearchTerm = clearTagSearchTerm;
    vm.onSearchHelplineOperatorTextChange = onSearchHelplineOperatorTextChange;
    vm.onSearchVolunteerTextChange = onSearchVolunteerTextChange;
    vm.onSearchAssigneeTextChange = onSearchAssigneeTextChange;
    vm.onSearchGuildTextChange = onSearchGuildTextChange;
    vm.onSearchStageTextChange = onSearchStageTextChange;
    vm.onSearchTaskStatusTextChange = onSearchTaskStatusTextChange;
    vm.onSearchTaskStatusCategoryTextChange = onSearchTaskStatusCategoryTextChange;
    vm.onSearchTaskTypeTextChange = onSearchTaskTypeTextChange;
    vm.onSearchTagTextChange = onSearchTagTextChange;

    vm.openSmartAssignPopup = openSmartAssignPopup;
    vm.openCreateBulkTasksPopup = openCreateBulkTasksPopup;
    vm.openImportDataPopup = openImportDataPopup;

    vm.taskcheckboxes = {};
    vm.taskcheckboxes.areAllBoxesChecked = areAllBoxesChecked;
    vm.taskcheckboxes.isMainBoxIndeterminate = isMainBoxIndeterminate;
    vm.taskcheckboxes.isChecked = isChecked;
    vm.taskcheckboxes.toggleAllBoxes = toggleAllBoxes;
    vm.taskcheckboxes.toggleBox = toggleBox;

    vm.assignTasks = assignTasks;

    vm.page = 1;

    activate();

    function activate() {
      TaskStatus.updateLocal();
      TaskTypes.updateLocal();

      Auth.getAuthenticatedUser($cookies.get('token'))
        .then(authenticatedUserGetSuccessFn, authenticatedUserGetErrorFn);

      Auth.getUserListByTypes(['SS','HL'])
        .then(getHelplineOperatorsSuccessFn, getHelplineOperatorsErrorFn);

      Tasks.getPageSize()
        .then(taskPageSizeGetSuccessFn, taskPageSizeGetErrorFn);

      Guilds.all()
        .then(guildsAllSuccessFn, guildsAllErrorFn);

      Stages.all()
        .then(stagesAllSuccessFn, stagesAllErrorFn);

      Tags.all()
        .then(tagsAllSuccessFn, tagsAllErrorFn);

      Tasks.length()
        .then(tasksLengthSuccessFn, tasksLengthErrorFn);

      TaskStatus.all()
        .then(taskStatusAllSuccessFn, taskStatusAllErrorFn);

      TaskStatusCategories.all()
        .then(taskStatusCategoriesAllSuccessFn, taskStatusCategoriesAllErrorFn);

      TaskTypes.all()
        .then(taskTypesAllSuccessFn, taskTypesAllErrorFn);

      Tags.all()
        .then(tagsAllSuccessFn, tagsAllErrorFn);

      function authenticatedUserGetSuccessFn(response) {
        vm.authenticated_user = response.data.user;
        if (response.data.guild) {
          vm.guild = response.data.guild.id;
        }

        vm.updateFilters();
      }

      function authenticatedUserGetErrorFn(response) {
        console.log('Error while getting authenticated user in TaskListController');
      }

      function taskPageSizeGetSuccessFn(response) {
        vm.page_size = response.data.page_size;
      }

      function taskPageSizeGetErrorFn(response) {
        console.log('Error while getting taskPageSize in TaskListController');
      }

      function getHelplineOperatorsSuccessFn(response) {
        vm.available_helpline_operators = response.data;
        vm.helpline_operators = response.data;
        vm.users = vm.available_users = vm.helpline_operators;
      }

      function getHelplineOperatorsErrorFn(response) {
        console.log('Error while getting helpline operators in TasksListingController');
      }

      function guildsAllSuccessFn(response) {
        vm.available_guilds = response.data;
        vm.guilds = response.data;
      }

      function guildsAllErrorFn(response) {
        console.log('Error while getting guilds in TaskListController');
      }

      function stagesAllSuccessFn(response) {
        vm.stages = response.data;
        vm.available_stages = response.data;
      }

      function stagesAllErrorFn(response) {
        console.log('Error while getting stages in TaskListController');
      }

      function tagsAllSuccessFn(response) {
        vm.tags = response.data;
        vm.available_tags = response.data;
      }

      function tagsAllErrorFn(response) {
        console.log('Error while getting stages in TaskListController');
      }

      function tasksAllSuccessFn(response) {
        vm.tasks = response.data.results;
      }

      function tasksAllErrorFn(response) {
        console.log('Error while getting stages in TaskListController');
      }

      function tasksLengthSuccessFn(response) {
        vm.tasks_length = response.data.length;
      }

      function tasksLengthErrorFn(response) {
        console.log('Error while getting tasks length');
      }

      function taskStatusAllSuccessFn(response) {
        vm.task_status = response.data;
        vm.available_task_status = response.data;
      }

      function taskStatusAllErrorFn(response) {
        console.log('Error while getting stages in TaskListController');
      }

      function taskStatusCategoriesAllSuccessFn(response) {
        vm.task_status_categories = response.data;
        vm.available_task_status_categories = response.data;
      }

      function taskStatusCategoriesAllErrorFn(response) {
        console.log('Error while getting stages in TaskListController');
      }

      function taskTypesAllSuccessFn(response) {
        vm.task_types = response.data;
        vm.available_task_types = response.data;
      }

      function taskTypesAllErrorFn(response) {
        console.log('Error while getting stages in TaskListController');
      }

      function tagsAllSuccessFn(response) {
        vm.tags = response.data;
        vm.available_tags = response.data;
      }

      function tagsAllErrorFn(response) {
        console.log('Error while getting all tags in TaskListController');
      }
    }

    function openSmartAssignPopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {
          stages: vm.stages,
          available_tags: vm.available_tags,
          tags: vm.tags,
          task_status: vm.task_status,
          task_status_categories: vm.task_status_categories,
          task_types: vm.task_types,
          volunteers: vm.volunteers,
          helpline_operators: vm.helpline_operators
        },
        controller: 'SmartAssignController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/tasks/smart-assign.html',
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

    function openCreateBulkTasksPopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {
          task_types: vm.task_types,
        },
        controller: 'CreateBulkTasksController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/tasks/create-bulk-tasks.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function() {
        vm.getAllTasks(vm.page);
      });
    }

    function openImportDataPopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        controller: 'ImportDataController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/tasks/import_data.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function() {
        vm.getAllTasks(vm.page);
      });
    }

    function clearHelplineOperatorsSearchTerm() {
      vm.search_helpline_operator_term = '';
    }

    function clearVolunteersSearchTerm() {
      vm.search_volunteer_term = '';
    }

    function clearAssigneeSearchTerm() {
      vm.search_assignee_term = '';
    }

    function clearGuildSearchTerm() {
      vm.search_guild_term = '';

      for (var g in vm.selected_guilds) {
        Guilds.members(vm.selected_guilds[g])
          .then(guildMembersSuccessFn, guildMembersErrorFn);
      }

      function guildMembersSuccessFn(response) {
        var users = response.data;

        for (var u in users) {
          vm.selected_volunteers.push(users[u].id);
        }
      }

      function guildMembersErrorFn(response) {
        console.log('Error while getting guild members in TaskListController');
      }
    }

    function clearStageSearchTerm() {
      vm.search_stage_term = '';
    }

    function clearTaskStatusSearchTerm() {
      vm.search_task_status_term = '';
    }

    function clearTaskStatusCategorySearchTerm() {
      vm.search_task_status_category_term = '';
    }

    function clearTaskTypeSearchTerm() {
      vm.search_task_type_term = '';
    }

    function clearTagSearchTerm() {
      vm.search_tag_term = '';
    }

    function onSearchHelplineOperatorTextChange($event) {
      $event.stopPropagation();

      vm.available_helpline_operators = $filter('filter')(vm.helpline_operators, {$: vm.search_helpline_operator_term});
    }

    function onSearchVolunteerTextChange($event) {
      $event.stopPropagation();

      vm.available_volunteers = $filter('filter')(vm.volunteers, {$: vm.search_volunteer_term});
    }

    function onSearchAssigneeTextChange($event) {
      $event.stopPropagation();

      vm.available_users = $filter('filter')(vm.users, {$: vm.search_assignee_term});
    }

    function onSearchGuildTextChange($event) {
      $event.stopPropagation();

      vm.available_guilds = $filter('filter')(vm.guilds, {$: vm.search_guild_term});
    }

    function onSearchStageTextChange($event) {
      $event.stopPropagation();
      vm.available_stages = $filter('filter')(vm.stages, {$: vm.search_stage_term});
    }

    function onSearchTaskStatusTextChange($event) {
      $event.stopPropagation();

      vm.available_task_status = $filter('filter')(vm.task_status, {$: vm.search_task_status_term});
    }

    function onSearchTaskStatusCategoryTextChange($event) {
      $event.stopPropagation();

      vm.available_task_status_categories = $filter('filter')(vm.task_status_categories, {$: vm.search_task_status_category_term});
    }

    function onSearchTaskTypeTextChange($event) {
      $event.stopPropagation();

      vm.available_task_types = $filter('filter')(vm.task_types, {$: vm.search_task_type_term});
    }

    function onSearchTagTextChange($event) {
      $event.stopPropagation();

      vm.available_tags = $filter('filter')(vm.tags, {$: vm.search_tag_term});
    }

    function areAllBoxesChecked() {
      return vm.selected_tasks.length === vm.tasks.length;
    }

    function isMainBoxIndeterminate() {
      return (vm.selected_tasks.length !== 0 &&
          vm.selected_tasks.length !== vm.tasks.length);
    }

    function isChecked(item, list) {
      return list.indexOf(item) > -1;
    }

    function toggleAllBoxes() {
      if (vm.selected_tasks.length === vm.tasks.length) {
        vm.selected_tasks = [];
      } else if (vm.selected_tasks.length === 0 || vm.selected_tasks.length > 0) {
        vm.selected_tasks = vm.tasks.slice(0);
      }
    }

    function toggleBox(item, list) {
      var idx = list.indexOf(item);
      if (idx > -1) {
        list.splice(idx, 1);
      } else {
        list.push(item);
      }
    };

    function updateFilterString(s) {
      var key = s.split('=')[0],
          values = s.split('=')[1];

      s = key;
      values = values.split(',');

      for (var v in values) {
        if (v > 0) {
          s += '&' + key;
        }

        if (values[v] != '') {
          s += '=' + values[v];
        }
      }

      if (vm.filter_string.length == 0) {
        vm.filter_string = s;
      } else {
        vm.filter_string += ('&' + s);
      }
    }

    function getAllTasks(page) {
      Tasks.allPaginated(page)
        .then(tasksListSuccessFn, tasksListErrorFn);

      function tasksListSuccessFn(data, status, headers, config) {
        vm.tasks = data.data.results;
      }

      function tasksListErrorFn(data, status, headers, config){
        console.log("Error while getting tasks for user");
      }
    }

    function getUserObjInTask(user_id, task, user_char) {
      Auth.getUser(
        user_id
      ).then(getUserSuccess, getUserFailure);

      function getUserSuccess(response) {
        task[user_char] = response.data;
      }
      function getUserFailure() {
        console.log("Failed to retrieve " + user_char + " with id " + user_id);
      }
    }

    function updateFilters() {
      var saved_filters = $localStorage.saved_filters;

      if (!vm.is_admin) {
        vm.filters['toggle_own_tasks_filter']['is_enabled'] = true;
        vm.filters['toggle_own_tasks_filter']['filter_value'] = vm.authenticated_user.id;
      }

      if (vm.filter_string === '') {
        vm.filter_applied = false;
      }

      if (saved_filters) {
        vm.filters = saved_filters;
      }

      for (var f in vm.filters) {
        var filter = vm.filters[f];

        if (vm.filters[f]['is_enabled']) {
          vm.filter_applied = true;
          updateFilterString(vm.filters[f]['filter_string'] + '=' + vm.filters[f]['filter_value']);
        }
      }

      $localStorage.saved_filters = vm.filters;

      Tasks.updateFilters(vm.filter_string, vm.page)
        .then(tasksFilterSuccessFn, tasksFilterErrorFn);

      vm.update_filter_in_progress = true;
      vm.displayed_tasks = [];

      function tasksFilterSuccessFn(response) {
        if (vm.export_flag) {
          Tasks.exportTasks(vm.filter_string)
            .then(exportTasksSuccessFn, exportTasksErrorFn);
        }

        vm.update_filter_in_progress = false;
        vm.filter_string = '';
        vm.displayed_tasks = response.data.results;
        vm.tasks = response.data.results;
        vm.tasks_length = response.data.count;
      }

      function tasksFilterErrorFn(response) {
        vm.update_filter_in_progress = false;
        vm.filter_string = '';
        vm.updateFilters();
        console.log('Error while applying filters in tasklist controller');
      }

      function exportTasksSuccessFn(response) {
        vm.export_flag = false;

        var anchor = angular.element('<a/>');
        anchor.attr({
          href: 'data:attachment/csv;charset=utf-8,' + encodeURI(response.data),
          target: '_blank',
          download: 'vms2_' + Date.now() + '.csv'
        })[0].click();
      }

      function exportTasksErrorFn(response) {
        vm.export_flag = false;
      }
    }

    function changePage() {
      updateFilters();
    }

    function clearFilters() {
      vm.filter_string = '';

      for (var f in vm.filters) {
        vm.filters[f]['is_enabled'] = false;
      }

      $localStorage.saved_filters = vm.filters;

      updateFilters();
    }

    function assignTasks() {
      Tasks.assignTasks(vm.selected_tasks, vm.selected_volunteers.concat(vm.selected_helpline_operators), true)
        .then(assignTasksSuccessFn, assignTasksErrorFn);

      vm.assignment_in_progress = true;

      function assignTasksSuccessFn(response) {
        updateFilters();
        vm.assignment_in_progress = false;
      }

      function assignTasksErrorFn(response) {
        console.log('Error while assigning');
      }
    }

    function startCall(task) {
      var data = {};
     


      if (task) {
        data.beneficiary = task.beneficiary.id;
        data.task = task.id;

        Calls.create(data)
          .then(callStartedSuccessFn, callStartedErrorFn);
      }

      function callStartedSuccessFn(response) {
        Calls.$current_call = response.data;
        if (task.form_data) {
          $location.url('/tasks/' + task.id + '/forms/' + task.task_type.form + '/data/add/' + task.form_data);
        } else {
          $location.url('/tasks/' + task.id + '/forms/' + task.task_type.form + '/data/add/');
        }
      }

      function callStartedErrorFn(response) {
        console.log('Error while starting a call in TaskController');
      }
    }

    function toggleAssign() {
      vm.show_assignment_options = !vm.show_assignment_options;
    }

    function openChangeStatusPopup(task, ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      var updated_task={};
      updated_task=task; 
      if (task && task.beneficiary && task.beneficiary.id) {
        updated_task.beneficiary = task.beneficiary.id;
      }

      if (task && task.task_type && task.task_type.id) {
        updated_task.task_type = task.task_type.id;
      }

      if (task && task.assignee && task.assignee.id) {
        updated_task.assignee = task.assignee.id;
      }

      $mdDialog.show({
        locals: {task: updated_task},
        controller: 'ChangeStatusFabController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/task_status/change-status.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(task) {
        console.log('Task status changed');
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function openNewMessagePopup(task, ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      if (task && task.beneficiary && task.beneficiary.id) {
        task.beneficiary = task.beneficiary.id;
      }

      $mdDialog.show({
        locals: {task: task},
        controller: 'NewMessageFabController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/user_messages/new-message.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(message) {
        console.log('Message sent', message);
      }, function() {
        console.log("this asdasdasd");
      });

      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    }



   function openChangeStagePopup(ev,task) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

  
      $mdDialog.show({
        locals: {user: task.beneficiary.id,task:task.id},
        controller: 'ChangeStageFabController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/stages/change-stage.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(user) {
        console.log('Stage Change', user);
      }, function() {
        console.log("this asdasdasd");
      });
    }


  function openAddTagPopup(ev,task) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

          var task_val=task;
          if (task && task.beneficiary && task.beneficiary.id) {
        task_val.beneficiary = task.beneficiary.id;
      }

      $mdDialog.show({
        locals: {task: task_val},
        controller: 'AddTagFabController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/tags/add-tag.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(tag) {
        console.log('Tag added', tag);
      }, function() {
        console.log("this asdasdasd");
      });
    }



  }
})();
