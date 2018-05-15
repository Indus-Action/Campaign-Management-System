(function () {
  'use strict';

  angular
    .module('vms2.task_status_categories.controllers')
    .controller('TaskStatusCategoryController', TaskStatusCategoryController);

  TaskStatusCategoryController.$inject = ['$scope', '$mdMedia', '$mdDialog', 'Auth', 'TaskStatusCategories'];

  function TaskStatusCategoryController($scope, $mdMedia, $mdDialog, Auth, TaskStatusCategories) {
    var vm = this,
        category = $scope.category;

    vm.creator = null;

    vm.openEditTaskStatusCategoryPopup = openEditTaskStatusCategoryPopup;

    if (category) {
      if (category.creator) {
        Auth.get(category.creator)
          .then(categoryCreatorGetSuccessFn, categoryCreatorGetErrorFn);
      }
    }

    function categoryCreatorGetSuccessFn(response) {
      vm.creator = response.data;
    }

    function categoryCreatorGetErrorFn(data, status, headers, config) {
      console.log('Error while getting task_status_category creator in TaskStatusCategoryController');
    }

    function openEditTaskStatusCategoryPopup(task_status_category, ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {data: task_status_category},
        controller: 'EditTaskStatusCategoryController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/task_status_categories/edit-task-status-category.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(data) {
        TaskStatusCategories.all()
          .then(categoriesAllSuccessFn, categoriesAllErrorFn)
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function categoriesAllSuccessFn(response) {
      $scope.parent.categories = response.data;
    }

    function categoriesAllErrorFn(response) {
      console.log('Error while getting categories');
    }
  }
})();
