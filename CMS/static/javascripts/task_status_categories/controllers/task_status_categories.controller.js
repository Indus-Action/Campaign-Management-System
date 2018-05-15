(function () {
  'use strict';

  angular
    .module('vms2.task_status_categories.controllers')
    .controller('TaskStatusCategoriesController', TaskStatusCategoriesController);

  TaskStatusCategoriesController.$inject = ['$scope', '$mdDialog', '$mdMedia', 'TaskStatusCategories'];

  function TaskStatusCategoriesController($scope, $mdDialog, $mdMedia, TaskStatusCategories) {
    var vm = this;

    vm.categories = [];
    vm.displayed_categories = [];

    vm.openNewCategoryPopup = openNewCategoryPopup;

    activate();

    function activate() {
      $scope.$watchCollection(function () { return $scope.categories; }, render);
    }

    function render(current, original) {
      if (current != original) {
        vm.categories = [];
        vm.displayed_categories = [];

        for (var i = 0; i < current.length; i++) {
          vm.displayed_categories.push(current[i]);
          vm.categories.push(current[i]);
        }
      }
    }

    function openNewCategoryPopup(ev) {
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
      }).then(function(category) {
        vm.categories.push(category)
      }, function() {
        console.log("this asdasdasd");
      });

      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    }
  }
})();
