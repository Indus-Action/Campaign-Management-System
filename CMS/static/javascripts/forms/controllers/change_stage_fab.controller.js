(function () {
  'use strict';

  angular
    .module('vms2.forms.controllers')
    .controller('ChangeStageFabController', ChangeStageFabController);

  ChangeStageFabController.$inject = ['$mdDialog', 'user', 'Auth', 'Stages','task'];

  function ChangeStageFabController($mdDialog, user, Auth, Stages,task) {
    var vm = this;
    vm.changeStage = changeStage;

    vm.selected_stage = null;
    vm.stage_change_in_progress = false;
    vm.stages = [];
    vm.user_profile = null;

    activate();

    function activate() {
      Auth.getUser(user)
        .then(userGetSuccessFn, userGetErrorFn);

      function userGetSuccessFn(response) {
        Auth.get(response.data.profile)
          .then(profileGetSuccessFn, profileGetErrorFn);

        function profileGetSuccessFn(response) {
          vm.user_profile = response.data;
          vm.selected_stage = vm.user_profile.stage;
        }

        function profileGetErrorFn(response) {
          console.log('Error while getting user profile in ChangeStatusFabController');
        }
      }

      function userGetErrorFn(response) {
        console.log('Error while getting user in ChangeStatusFabController');
      }

      Stages.all()
        .then(StagesAllSuccessFn, StagesAllErrorFn);

      function StagesAllSuccessFn(response) {
        vm.stages = response.data;
      }

      function StagesAllErrorFn(response) {
        console.log('Error while getting task status in ChangeStageFabController');
      }
    }

    function changeStage() {
      vm.stage_change_in_progress = false;

      vm.user_profile.stage = vm.selected_stage;
      vm.user_profile.task=task;

      Auth.updateUserProfile(vm.user_profile)
        .then(userProfileUpdateSuccessFn, userProfileUpdateErrorFn);

      function userProfileUpdateSuccessFn(response) {
        $mdDialog.hide(response.data);
        vm.stage_change_in_progress = false;
      }

      function userProfileUpdateErrorFn(response) {
        console.log('Error while changing data in ChangeStatusFabController');
      }
    }
  }
})();
