(function () {
  'use strict';

  angular
    .module('vms2.auth.controllers')
    .controller('LoginController', LoginController);

  LoginController.$inject = ['Auth', '$cookies', '$scope',
                             '$localStorage', '$mdDialog', '$mdMedia'];

  function LoginController(Auth, $cookies, $scope, $localStorage, $mdDialog, $mdMedia) {

    $scope.loading = false;
    $scope.loginfail = false;
    $scope.user_detail = {};

    $scope.loginPerform = function () {
      $scope.loading = true;

      Auth.login(
          $scope.user_detail.username,
          $scope.user_detail.password
        ).then(loginSuccessCallback, loginErrorCallback);

      function loginSuccessCallback(response) {
        $scope.loading = false;
        $cookies.put('token', response.data.key);
        $scope.loginfail = false;

        // Show loading again. Repeated on purpose for distinction.
        $scope.loading = true;
        Auth.getAuthenticatedUser(
          $cookies.get('token')
        ).then(getAuthUserDataSuccess, getAuthUserDataFailure);

        function getAuthUserDataSuccess(response) {
          var user = {};
          user.id = response.data.user.id;
          user.profile_id = response.data.id;
          user.username = response.data.user.username;
          user.email = response.data.user.email;
          user.first_name = response.data.user.first_name;
          user.last_name = response.data.user.last_name;
          user.mobile = response.data.mobile;
          user.points = response.data.points;
          user.type = response.data.user_type;

          $localStorage.user = user;
          $scope.loginfail = false;
          $scope.loading = false;
        }
        function getAuthUserDataFailure() {
          $scope.loginfail = true;
          Auth.logout();
          $scope.loading = false;
        }
        $mdDialog.hide(!$scope.loginfail);
      }
      function loginErrorCallback(response) {
        $scope.loading = false;
        $scope.loginfail = true;
        $scope.registerfailmessages = response.data;
      }
    };

    $scope.resetPassword = function (ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.cancel();

      $mdDialog.show({
        controller: 'ResetPasswordController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/auth/reset-password.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function() {

      }, function() {
        console.log("Reset Password cancelled.");
      });
    }

    $scope.hide = function (loginsuccess) {
      $mdDialog.hide(loginsuccess);
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };
  }
})();
