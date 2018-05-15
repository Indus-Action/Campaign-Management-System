(function () {
  'use strict';

  angular
    .module('vms2.auth.controllers')
    .controller('RegistrationController', RegistrationController);

  RegistrationController.inject = ['Auth', '$scope', '$mdDialog', '$mdMedia'];

  function RegistrationController(Auth, $scope, $mdDialog, $mdMedia) {
    $scope.user_detail = {};
    $scope.registerfail = false;
    $scope.registerfailmessages = {};
    $scope.loading = false;
    $scope.matchpass = false;

    $scope.registerPerform = function () {
      $scope.loading = true;

      Auth.register($scope.user_detail)
        .then(registerSuccessCallback, registerErrorCallback);

      function registerSuccessCallback(response) {
        $scope.registerfail = false;
        $mdDialog.hide();
        $scope.loading = false;
      }

      function registerErrorCallback(response) {
        $scope.registerfail = true;
        $scope.loading = false;
        $scope.registerfailmessages = response.data;
        console.log("Registration failed.");
      }
    };

    $scope.matchPass = function(form) {
      form.password2.$error.matchPassword = $scope.user_detail.password2 != $scope.user_detail.password1;
      $scope.matchpass = form.password2.$error.matchPassword;
      form.password2.$setValidity('matchPassword', !$scope.matchpass);
    };

    $scope.hide = function() {
      $mdDialog.hide();
    };

    $scope.cancel = function () {
      $mdDialog.cancel();
    };
  }
})();
