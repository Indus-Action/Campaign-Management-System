(function () {
  'use strict';

  angular
    .module('vms2.tasks.services')
    .factory('Tasks', Tasks);

  Tasks.$inject = ['$http'];

  function Tasks($http) {
    var Tasks = {
      all: all,
      allPaginated: allPaginated,
      create: create,
      createBulkTasks: createBulkTasks,
      get: get,
      getPageSize: getPageSize,
      length: length,
      update: update,
      getBeneficiaryTasks: getBeneficiaryTasks,
      getAssignedTasks: getAssignedTasks,
      getCreatedTasks: getCreatedTasks,
      assignTasks: assignTasks,
      smartAssignTasks: smartAssignTasks,
      updateFilters: updateFilters,
      exportTasks: exportTasks,
      importData: importData
    };

    return Tasks;

    function all() {
      return $http.get('/api/v1/tasks/');
    }

    function allPaginated(page) {
      return $http.get('/api/v1/paginated_tasks/?page=' + page);
    }

    function create(data) {

      return $http.post('/api/v1/tasks/create/', {
        assignee: data.assignee.id,
        mobile:data.mobile,
        task_status: data.status.id,
        task_type: data.task_type.id,

      });
    }

    function createBulkTasks(data) {
      return $http.post('/api/v1/tasks/bulk_create/', {
        task_status: data.task_status,
        task_type: data.task_type,
        number_of_tasks: data.number_of_tasks,
        users: data.users,
        splits: data.splits,
        equal_splits: true,
        random_assign: data.random_assign,
        assignee_type: data.assignee_type
      });
    }

    function get(id) {
      return $http.get('/api/v1/tasks/' + id + '/');
    }

    function getPageSize() {
      return $http.get('/api/v1/tasks/page_size/');
    }

    function length() {
      return $http.get('/api/v1/tasks/length/');
    }

    function update(task) {
      return $http.put('/api/v1/tasks/' + task.id + '/', task);
    }

    function getBeneficiaryTasks(user) {
      return $http.get('/api/v1/tasks/beneficiary/' + user + '/');
    }

    function getAssignedTasks(user) {
      return $http.get('/api/v1/tasks/assignee/' + user + '/');
    }

    function getCreatedTasks(user) {
      return $http.get('/api/v1/tasks/creator/' + user + '/');
    }

    function assignTasks(tasks, users, equal_splits, splits) {
      return $http.post('/api/v1/tasks/assign/', {
        tasks: tasks,
        users: users,
        splits: splits,
        equal_splits: true      // TODO: Add a text field for splits. For now, it will be equal
      });
    }

    function smartAssignTasks(data) {
      return $http.post('/api/v1/tasks/assign/', {
        stages: data.stages,
        task_status: data.task_status,
        task_status_categories: data.task_status_categories,
        task_types: data.task_types,
        tags: data.tags,
        assignees: data.assignees,
        users: users,
        splits: splits,
        equal_splits: true      // TODO: Add a text field for splits. For now, it will be equal
      });
    }

    function updateFilters(get_params, page) {
      return $http.get('/api/v1/tasks/filter/?' + get_params + '&page=' + page);
    }

    function exportTasks(get_params) {
      return $http.get('/api/v1/tasks/export/?' + get_params);
    }

    function importData(data) {
      return $http.post('/api/v1/tasks/import/', {
        data: data.data,
        success_task_status: data.success_task_status,
        failure_task_status: data.failure_task_status
      });
    }
  }
})();
