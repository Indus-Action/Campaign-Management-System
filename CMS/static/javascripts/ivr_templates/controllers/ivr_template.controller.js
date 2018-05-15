(function () {
  'use strict';

  angular
    .module('vms2.ivr_templates.controllers')
    .controller('IVRTemplateController', IVRTemplateController);

  IVRTemplateController.$inject = ['$mdDialog', '$mdMedia', '$scope', 'Auth', 'IVRTemplates'];

  function IVRTemplateController($mdDialog, $mdMedia, $scope, Auth, IVRTemplates) {
    var vm = this,
        template = $scope.ivrt;

    vm.creator = null;

    vm.openEditIVRTemplatePopup = openEditIVRTemplatePopup;

    if (template) {
      if (template.creator) {
        Auth.get(template.creator)
          .then(IVRTemplateCreatorGetSuccessFn, IVRTemplateCreatorGetErrorFn);
      }
    }

    function IVRTemplateCreatorGetSuccessFn(response) {
      vm.creator = response.data;
    }

    function IVRTemplateCreatorGetErrorFn(response) {
      console.log('Error while getting IVR Template creator in IVRTemplateController');
    }

    function openEditIVRTemplatePopup(template, ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {data: template},
        controller: 'EditIVRTemplateController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/ivr_templates/edit-ivr-template.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(data) {
        IVRTemplates.all()
          .then(IVRTemplatesAllSuccessFn, IVRTemplatesAllErrorFn);
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function IVRTemplatesAllSuccessFn(response) {
      $scope.parent.ivr_templates = response.data;
    }

    function IVRTemplatesAllErrorFn(data, status, headers, config) {
      console.log('Error while getting message templates');
    }
  }
})();
