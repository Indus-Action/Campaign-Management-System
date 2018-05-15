(function () {
  'use strict';

  angular
    .module('vms2.notices.controllers')
    .controller('NoticesController', NoticesController);

  NoticesController.$inject = ['$mdDialog', '$mdMedia', '$scope', 'Auth', 'Notices'];

  function NoticesController($mdDialog, $mdMedia, $scope, Auth, Notices) {
    var vm = this;

    vm.notices = [];
    vm.displayed_notices = [];

    vm.openNewNoticePopup = openNewNoticePopup;
    vm.is_authenticated = Auth.isAuthenticated();
    vm.is_admin = Auth.isAdmin();

    activate();

    function activate() {
      $scope.$watchCollection(function () { return $scope.notices; }, render);
    }

    function render(current, original) {
      if (current != original) {
        vm.notices = [];
        vm.displayed_notices = [];

        for (var i = 0; i < current.length; i++) {
          vm.displayed_notices.push(current[i]);
          vm.notices.push(current[i]);
        }
      }
    }

    function openNewNoticePopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        controller: 'NewNoticeController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/notices/new-notice.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(notice) {
        vm.notices.push(notice)
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
