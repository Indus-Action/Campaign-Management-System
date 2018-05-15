(function () {
	'use strict';

	angular
    .module('vms2.auth.controllers')
    .controller('UpdateProfileController', UpdateProfileController);

  UpdateProfileController.inject = ['Auth', '$scope', '$mdDialog',
                                    '$mdMedia', '$cookies', '$localStorage'];

  function UpdateProfileController(Auth, $scope, $mdDialog, $mdMedia, $cookies, $localStorage) {
    $scope.user_details = {};
    $scope.updatefail = false;
    $scope.updatefailmessages = {};
    $scope.loading = false;

    $scope.retrieveProfileDetails = function () {
      $scope.loading = true;

      if($localStorage.user) {
        angular.copy($localStorage.user, $scope.user_details);
        $scope.loading = false;
      }
      else {
        Auth.logout();
        $scope.loading = false;
      }
    };

    $scope.retrieveUserTypes = function () {
      $scope.loading = true;

      Auth.getUserTypes().then(getUserTypesSuccess, getUserTypesFailure);

      function getUserTypesSuccess(response) {
        $scope.usertypes = response.data;
        $scope.loading = false;
        console.log("User types retrieved.");
      }

      function getUserTypesFailure() {
        $scope.loading = false;
        console.log("Failed to retrieve user types.");
      }
    };

    $scope.updatePerform = function () {
      $scope.loading = true;

      Auth.update(
          $cookies.get('token'),
          $scope.user_details
        )
        .then(updateSuccessCallback, updateFailureCallback);

      function updateSuccessCallback(response) {
        $scope.updatefail = false;
        $mdDialog.hide();
        $scope.loading = false;

        Auth.getAuthenticatedUser(
          $cookies.get('token')
        ).then(getAuthUserDataSuccess, getAuthUserDataFailure);

        function getAuthUserDataSuccess(response) {
          var user = {};
          user.id = response.data.user.id;
          user.username = response.data.user.username;
          user.email = response.data.user.email;
          user.first_name = response.data.user.first_name;
          user.last_name = response.data.user.last_name;
          user.mobile = response.data.mobile;
          user.points = response.data.points;
          user.type = response.data.user_type;

          $localStorage.user = user;
        }
        function getAuthUserDataFailure() {
          vm.loginfail = true;
          Auth.logout();
        }
        $mdDialog.hide()
      }

      function updateFailureCallback(response) {
        $scope.updatefail = true;
        $scope.loading = false;
        $scope.updatefailMessages = response.data;
        console.log("Update profile failed.");
      }
    };

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function() {
      $mdDialog.cancel();
    };

    $scope.retrieveProfileDetails();
    $scope.retrieveUserTypes();
  }
})();
