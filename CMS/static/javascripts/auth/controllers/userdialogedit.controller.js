(function () {
  'use strict';

  angular
    .module('vms2.auth.controllers')
    .controller('UserDialogEditController', UserDialogEditController);

  UserDialogEditController.inject = ['Auth', 'UserID', '$mdMedia', '$mdDialog'];

  function UserDialogEditController(Auth, UserID, $mdMedia, $mdDialog) {
    var vm = this;
    vm.profile = {};
    vm.profile.id = UserID;
    vm.loading = false;
    vm.updatefail = false;
    vm.updatefailmessages = {};
    vm.usertypes = {};

    vm.getUserTypes = function () {
      vm.loading = true;

      Auth.getUserTypes().then(getUserTypesSuccess, getUserTypesFailure);

      function getUserTypesSuccess(response) {
        vm.usertypes = response.data;
        vm.loading = false;
        console.log("User types retrieved.");
      }
      function getUserTypesFailure() {
        vm.loading = false;
        console.log("Failed to retrieve user types.");
      }
    };

    vm.getUser = function () {
      vm.loading = true;

      Auth.get(
        vm.profile.id
      ).then(getUserSuccess, getUserFailure);

      function getUserSuccess(response) {
        vm.loading = false;
        vm.profile = response.data;
        console.log("User data retrieved.");
      }
      function getUserFailure() {
        vm.loading = false;
        console.log("Failed to retrieve user data.");
      }
    };

    vm.updateUser = function () {
      vm.loading = true;

      Auth.userUpdateByAdmin(
        vm.profile
      ).then(updateSuccess, updateFailure);

      function updateSuccess() {
        vm.loading = false;
        console.log("User updated successfully.");
        $mdDialog.hide();
      }
      function updateFailure(response) {
        vm.loading = false;
        vm.updatefail = true;
        vm.updatefailmessages = response.data;
        console.log("User update failed.");
      }
    };
    
    vm.hide = function(mes) {
      $mdDialog.hide(mes);
    };

    vm.cancel = function() {
      $mdDialog.cancel();
    };

    vm.getUserTypes();
    vm.getUser();
  }
})();
