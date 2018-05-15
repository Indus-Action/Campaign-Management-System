(function () {
  'use strict';

  angular
    .module('vms2.task_status_categories.services')
    .factory('TaskStatusCategories', TaskStatusCategories);

  function TaskStatusCategories($http) {
    var TaskStatusCategories = {
      all: all,
      get: get,
      getTaskCompletedFlagChoices: getTaskCompletedFlagChoices,
      create: create,
      update: update,
      remove: remove
    };

    return TaskStatusCategories;

    function all() {
      return $http.get('/api/v1/task_status_categories/');
    }

    function get(id) {
      return $http.get('/api/v1/task_status_categories/' + id + '/');
    }

    function getTaskCompletedFlagChoices() {
      return $http.get('/api/v1/task_status_categories/flag_choices/');
    }

    function create(data) {
      return $http.post('/api/v1/task_status_categories/', {
        category: data.category,
        desc: data.desc,
        task_completed_flag: data.task_completed_flag
      });
    }

    function update(task_status_category) {
      return $http.put('/api/v1/task_status_categories/' + task_status_category.id + '/',
                       task_status_category);
    }

    function remove(task_status_category) {
      return $http.delete('/api/v1/task_status_categories/' + task_status_category.id + '/');
    }
  }
})();
