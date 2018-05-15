(function () {
  angular
    .module('vms2.tasks.controllers')
    .controller('TaskController', TaskController);

  TaskController.$inject = ['$location', '$mdDialog', '$mdMedia', '$scope',
                            'Auth', 'Calls', 'FeedbackTypes', 'TaskStatus',
                            'TaskTypes', 'TrainingKit'];

  function TaskController($location, $mdDialog, $mdMedia, $scope,
                          Auth, Calls, FeedbackTypes, TaskStatus,
                          TaskTypes, TrainingKit) {
    var vm = this;

    vm.assignee = null;
    vm.task_status = null;
    vm.task_type = null;
    vm.feebback_type = null;

    vm.assignee = null;

    vm.openChangeStatusPopup = openChangeStatusPopup;
    vm.openNewMessagePopup = openNewMessagePopup;
    vm.startCall = startCall;

    activate();

    function activate() {
      var task = $scope.task;

      if (task) {
        if (task.task_type) {
          TaskTypes.get(task.task_type)
            .then(TaskTypeGetSuccessFn, TaskTypeGetErrorFn);
        }

        if (task.assignee) {
          Auth.getUser(task.assignee)
            .then(AssigneeGetSuccessFn, AssigneeGetErrorFn);
        }

        if (task.status) {
          TaskStatus.get(task.status)
            .then(TaskStatusGetSuccessFn, TaskStatusGetErrorFn);
        }
      }

      function AssigneeGetSuccessFn(data) {
        vm.assignee = data.data;
      }

      function AssigneeGetErrorFn(data) {
        console.log('Error while getting assignee');
      }

      function TaskTypeGetSuccessFn(data) {
        vm.task_type = data.data;

        if (vm.task_type.feedback_type) {
          FeedbackTypes.get(vm.task_type.feedback_type)
            .then(FeedbackTypeGetSuccessFn, FeedbackTypeGetErrorFn);
        }

        if (vm.task_type.training_kit) {
          TrainingKit.get(vm.task_type.training_kit)
            .then(TrainingKitGetSuccessFn, TrainingKitGetErrorFn);
        }
      }

      function TaskTypeGetErrorFn(data) {
        console.log('Error while getting task type in Task Controller');
      }

      function TaskStatusGetSuccessFn(data) {
        vm.task_status = data.data;
      }

      function TaskStatusGetErrorFn(data) {
        console.log('Error while getting task status in TaskController');
      }

      function FeedbackTypeGetSuccessFn(data) {
        vm.feedback_type = data.data;
      }

      function FeedbackTypeGetErrorFn(data) {
        console.log('Error while getting feedback type in TaskController');
      }

      function TrainingKitGetSuccessFn(data) {
        vm.training_kit = data.data;
      }

      function TrainingKitGetErrorFn(data) {
        console.log('Error while getting training kit in TaskController');
      }
    }

    function openChangeStatusPopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {task: $scope.task},
        controller: 'ChangeStatusFabController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/task_status/change-status.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(message) {
        console.log('Message sent', message);
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function startCall() {
      var task = $scope.task,
          data = {};

      if (task) {
        data.beneficiary = task.beneficiary;
        data.task = task.id;

        Calls.create(data)
          .then(callStartedSuccessFn, callStartedErrorFn);
      }

      function callStartedSuccessFn(response) {
        Calls.$current_call = response.data;
        $location.url('/tasks/' + task.id + '/forms/' + vm.task_type.form + '/data/add/' + task.form_data);
      }

      function callStartedErrorFn(response) {
        console.log('Error while starting a call in TaskController');
      }
    }

    function openNewMessagePopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {task: $scope.task},
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
  }
})();
