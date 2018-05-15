(function () {
  'use strict';

  angular
    .module('vms2.nav.controllers')
    .controller('NavController', NavController);

  NavController.$inject = ['$mdDialog', '$mdMedia', '$scope', 'Auth',
                           '$cookies', '$localStorage', '$location'];

  function NavController($mdDialog, $mdMedia, $scope, Auth, $cookies, $localStorage, $location) {
    var vm = this;

    vm.openSearchDialog = openSearchDialog;

    function openSearchDialog(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        controller: 'SearchController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/core/search.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function () {
        console.log("Seach Successful");
      }, function() {
        console.log("Login dialog cancelled.");
      });
    }

    vm.loginPopup = function (ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

          $mdDialog.show({
            controller: 'LoginController',
            templateUrl: '/static/templates/auth/login.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: use_full_screen
          }).then(function(isloginsuccess) {
            if(isloginsuccess && $localStorage.user && (!$localStorage.user.first_name || !$localStorage.user.last_name)) {
              vm.updateUserDetails();
            }
            console.log("isloginsuccess: " + isloginsuccess);
          }, function() {
            console.log("Login dialog cancelled.");
          });

      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };

    vm.registerPopup = function (ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

          $mdDialog.show({
            controller: 'RegistrationController',
            templateUrl: '/static/templates/auth/register.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: use_full_screen
          }).then(function() {
            console.log("this was clicked");
          }, function() {
            console.log("this asdasdasd");
          });

      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };

    vm.updateUserDetails = function (ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

          $mdDialog.show({
            controller: 'UpdateProfileController',
            templateUrl: '/static/templates/auth/update_details.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose:true,
            fullscreen: use_full_screen
          }).then(function() {
            console.log("this was clicked");
          }, function() {
            console.log("this asdasdasd");
          });

      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    };

    vm.logoutPerform = function () {
      Auth.logout();
    };

    vm.is_authenticated = function () {
      return Auth.isAuthenticated();
    };

    vm.is_admin = function () {
      return Auth.isAdmin();
    };

    vm.checkAuthConsistency = function () {
      if(!$cookies.get('token') && typeof $localStorage.user != "undefined") {
        Auth.logout();
      }
      if($cookies.get('token') && typeof $localStorage.user == "undefined") {
        Auth.logout();
      }
      if(!$cookies.get('token') && typeof $localStorage.user == "undefined") {
        if(!Auth.isAuthSkipPath($location.path())) {
          $location.path('/');
        }
      }
    };

    vm.checkAuthConsistency();
  };
})();
