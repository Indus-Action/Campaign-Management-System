(function () {
  'use strict';

  angular
    .module('vms2.tasks.controllers')
    .controller('SmartAssignController', SmartAssignController);

  SmartAssignController.$inject = ['$filter', '$mdDialog', 'stages', 'tags', 'task_status',
                                   'task_status_categories', 'task_types',
                                   'volunteers', 'helpline_operators'];

  function SmartAssignController($filter, $mdDialog, stages, tags, task_status,
                                 task_status_categories, task_types,
                                 volunteers, helpline_operators) {
    var vm = this;

    vm.data = {};

    vm.stages = stages;
    vm.tags = vm.available_tags = tags;
    vm.task_status = task_status;
    vm.task_status_categories = task_status_categories;
    vm.task_types = task_types;
    vm.volunteers = volunteers;
    vm.available_volunteers = volunteers;
    vm.helpline_operators = helpline_operators;
    vm.available_helpline_operators = helpline_operators;
    vm.users = vm.available_users = vm.volunteers.concat(vm.helpline_operators);

    vm.selected_helpline_operators = [];
    vm.selected_volunteers = [];
    vm.data.tags = [];
    vm.data.assignees = [];
    vm.data.stages = [];
    vm.data.task_status = [];
    vm.search_helpline_operator_term = '';
    vm.search_volunteer_term = '';
    vm.search_tag_term = '';
    vm.search_assignee_term = '';

    vm.clearHelplineOperatorsSearchTerm = clearHelplineOperatorsSearchTerm;
    vm.clearVolunteersSearchTerm = clearVolunteersSearchTerm;
    vm.clearTagSearchTerm = clearTagSearchTerm;
    vm.clearAssigneeSearchTerm = clearAssigneeSearchTerm;
    vm.onSearchHelplineOperatorTextChange = onSearchHelplineOperatorTextChange;
    vm.onSearchVolunteerTextChange = onSearchVolunteerTextChange;
    vm.onSearchTagTextChange = onSearchTagTextChange;
    vm.onSearchAssigneeTextChange = onSearchAssigneeTextChange;

    vm.cancel = cancel;

    function clearHelplineOperatorsSearchTerm() {
      vm.search_helpline_operator_term = '';
    }

    function clearVolunteersSearchTerm() {
      vm.search_volunteer_term = '';
    }

    function clearTagSearchTerm() {
      vm.search_tag_term = '';
    }

    function clearAssigneeSearchTerm() {
      vm.search_assignee_term = '';
    }

    function onSearchHelplineOperatorTextChange($event) {
      $event.stopPropagation();

      vm.available_helpline_operators = $filter('filter')(vm.helpline_operators, {$: vm.search_helpline_operator_term});
    }

    function onSearchVolunteerTextChange($event) {
      $event.stopPropagation();

      vm.available_volunteers = $filter('filter')(vm.volunteers, {$: vm.search_volunteer_term});
    }

    function onSearchTagTextChange($event) {
      $event.stopPropagation();

      vm.available_tags = $filter('filter')(vm.tags, {$: vm.search_tag_term});
    }

    function onSearchAssigneeTextChange($event) {
      $event.stopPropagation();

      vm.available_users = $filter('filter')(vm.users, {$: vm.search_assignee_term});
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
