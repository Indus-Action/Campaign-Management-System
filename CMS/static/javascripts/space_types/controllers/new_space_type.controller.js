(function () {
  'use strict';

  angular
    .module('vms2.space_types.controllers')
    .controller('NewSpaceTypeController', NewSpaceTypeController);

  NewSpaceTypeController.$inject = ['SpaceTypes', '$routeParams', '$cookies', '$mdDialog'];

  function NewSpaceTypeController(SpaceTypes, $routeParams, $cookies, $mdDialog) {
    var vm = this;

    vm.space_type_creation_in_progress = false;
    vm.space_type_creation_failed = false;
    vm.space_type_creation_failed_messages = [];

    vm.data = {};

    vm.createNewSpaceType = createNewSpaceType;
    vm.cancel = cancel;

    function createNewSpaceType() {
      vm.notice_creation_in_progress = true;

      SpaceTypes.create(vm.data)
        .then(SpaceTypeCreationSuccessFn, SpaceTypeCreationErrorFn);

      function SpaceTypeCreationSuccessFn(response) {
        vm.space_type_creation_in_progress = false;
        $mdDialog.hide(response.data);
      }

      function SpaceTypeCreationErrorFn(response) {
        vm.space_type_creation_failed = true;
        vm.space_type_creation_failed_messages = response.data;
        vm.space_type_creation_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
