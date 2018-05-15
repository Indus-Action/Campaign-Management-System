(function () {
  'use strict';

  angular
    .module('vms2.auth.controllers')
    .controller('UserManagementController', UserManagementController);

  UserManagementController.inject = ['Auth', '$scope', '$mdDialog', '$mdMedia'];

  function UserManagementController(Auth, $scope, $mdDialog, $mdMedia) {
    var vm = this;
    vm.userlist = [];

    vm.updatefail = false;
    vm.failmessages = {};
    vm.loading = false;
    vm.is_admin = Auth.isAdmin();
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

    vm.getUserList = function() {
      vm.loading = true;

      Auth.getUserListByTypes(['HL', 'VL', 'AD'])
        .then(usersGetSuccessFn, usersGetErrorFn);

      function usersGetSuccessFn(response) {
        vm.userlist = response.data;
        vm.loading = false;
      }

      function usersGetErrorFn() {
        vm.loading = false;
        console.log("Failed to retrieve user list.");
      }
    };

    vm.openDialog = function(user_id) {
      function userDialog(ev) {
        var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

        $mdDialog.show({
          controller: 'UserDialogEditController',
          controllerAs: 'vm',
          templateUrl: '/static/templates/auth/userdialogedit.html',
          locals: {UserID: user_id},
          parent: angular.element(document.body),
          targetEvent: ev,
          clickOutsideToClose:true,
          fullscreen: use_full_screen
        }).then(function(kit_data) {
          vm.getUserList();
          console.log("Dialog for user details closed.");
        }, function() {
          vm.getUserList();
          console.log("User details dialog canceled.");
        });

        $scope.$watch(function() {
          return $mdMedia('xs') || $mdMedia('sm');
        }, function(wantsFullScreen) {
          $scope.customFullscreen = (wantsFullScreen === true);
        });
      }
      userDialog();
    };

    vm.deleteUser = function(user_id, ev) {
      vm.loading = true;

      var confirm = $mdDialog.confirm()
            .title('Do you really want to delete this user?')
            .ariaLabel('Delete user.')
            .targetEvent(ev)
            .ok('Yes')
            .cancel('No');

      $mdDialog.show(confirm).then(function() {
        Auth.deleteUser(
          user_id
        ).then(deleteUserSuccess, deleteUserFailure);

        function deleteUserSuccess() {
          console.log("User deleted successfully.");
          vm.getUserList();
        }
        function deleteUserFailure() {
          console.log("User deletion failed.");
        }
      }, function() {
        console.log("User pardoned.");
      });
    };

    vm.getUserList();
    vm.getUserTypes();
  }
})();
