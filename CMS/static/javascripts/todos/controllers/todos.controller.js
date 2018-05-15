(function () {
  'use strict';

  angular
    .module('vms2.todos.controllers')
    .controller('TodosController', TodosController);

  TodosController.$inject = ['$scope', '$mdDialog', '$mdMedia', 'Todos'];

  function TodosController($scope, $mdDialog, $mdMedia, Todos) {
    var vm = this;

    vm.todos = [];
    vm.displayed_todos = [];

    vm.openNewTodoPopup = openNewTodoPopup;

    activate();

    function activate() {
      $scope.$watchCollection(function () { return $scope.todos; }, render);
    }

    function render(current, original) {
      if (current != original) {
        vm.todos = [];
        vm.displayed_todos = [];

        for (var i = 0; i < current.length; i++) {
          vm.displayed_todos.push(current[i]);
          vm.todos.push(current[i]);
        }
      }
    }

    function openNewTodoPopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        controller: 'NewTodoController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/todos/new-todo.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(todo) {
        vm.todos.push(todo)
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
