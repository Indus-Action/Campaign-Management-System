(function () {
  'use strict';

  angular
    .module('vms2.ivr_templates.controllers')
    .controller('IVRTemplatesController', IVRTemplatesController);

  IVRTemplatesController.$inject = ['$mdDialog', '$mdMedia', '$scope', 'IVRTemplates'];

  function IVRTemplatesController($mdDialog, $mdMedia, $scope, IVRTemplates) {
    var vm = this;

    vm.ivr_templates = [];
    vm.displayed_ivr_templates = [];

    vm.openNewIVRTemplatePopup = openNewIVRTemplatePopup;

    activate();

    function activate() {
      $scope.$watchCollection(function () { return $scope.ivrts; }, render);
    }

    function render(current, original) {
      if (current != original) {
        vm.ivr_templates = [];
        vm.displayed_ivr_templates = [];

        for (var i = 0; i < current.length; i++) {
          vm.displayed_ivr_templates.push(current[i]);
          vm.ivr_templates.push(current[i]);
        }
      }
    }

    function openNewIVRTemplatePopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        controller: 'NewIVRTemplateController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/ivr_templates/new-ivr-template.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(ivr_template) {
        vm.ivr_templates.push(ivr_template);
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
