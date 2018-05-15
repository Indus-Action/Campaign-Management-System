(function () {
  'use strict';

  angular
    .module('vms2.routes')
    .config(config);

  config.$inject = ['$routeProvider'];

  function config($routeProvider) {
    $routeProvider.when('/', {
      controller: 'IndexController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/layout/index.html'
    }).when('/locations/new', {
      controller: 'NewLocationController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/locations/new-location.html'
    }).when('/tasks/list', {
      controller: 'TasksListingController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/tasks/tasks-listing.html'
    }).when('/tasks/all', {
      controller: 'TasksListController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/tasks/tasks-list.html'
    }).when('/tasks/new', {
      controller: 'NewTaskController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/tasks/new-task.html'
    }).when('/tasks/settings', {
      controller: 'TasksSettingsController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/tasks/settings.html'
    }).when('/tasks/:id', {
      controller: 'TaskDetailController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/tasks/detail.html'
    }).when('/auth/verifyaccount/:key', {
      controller: 'AccountVerificationController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/auth/accountverify.html'
    }).when('/auth/password/reset/confirm/', {
      controller: 'PasswordResetConfirmController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/auth/password-reset-confirm.html'
    }).when('/auth/usermanagement', {
      controller: 'UserManagementController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/auth/usermanagement.html'
    }).when('/users/:id', {
      controller: 'UserDetailController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/auth/user-details.html'
    }).when('/forms/', {
      controller: 'FormsController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/forms/formlist.html'
    }).when('/forms/:id/data', {
      controller: 'FormDataController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/forms/form_data.html'
    }).when('/tasks/:task_id/forms/:form_id/data/add/:data_id?', {
      controller: 'FormDataAddController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/forms/form_data_add.html'
    }).when('/forms/studio/:id?', {
      controller: 'FormStudioController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/forms/formstudio.html'
    }).when('/training/', {
      controller: 'TrainingKitsController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/trainingkits/kitlist.html'
    }).when('/training/:id/pages', {
      controller: 'PageListController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/trainingkits/pagelist.html'
    }).when('/training/:id/showcase', {
      controller: 'KitShowcaseController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/trainingkits/kitshowcase.html'
    }).when('/hooks', {
      controller: 'EventConditionsListController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/event_conditions/event-conditions-list.html'
    }).when('/helpline', {
      controller: 'HelplineConditionsListController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/event_conditions/helpline-event-conditions-list.html'
    }).when('/guilds', {
      controller: 'GuildListController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/guilds/list.html'
    }).when('/noticeboard', {
      controller: 'NoticeBoardController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/notices/notice-board.html'
    }).when('/calendar', {
      controller: 'TodosListController',
      controllerAs: 'vm',
      templateUrl: '/static/templates/todos/calendar.html'
    }).otherwise('/');
  }
})();
