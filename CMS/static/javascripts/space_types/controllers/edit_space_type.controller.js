(function () {
  angular
    .module('vms2.space_types.controllers')
    .controller('EditSpaceTypeController', EditSpaceTypeController);

  EditSpaceTypeController.$inject = ['$mdDialog', 'data', 'SpaceTypes'];

  function EditSpaceTypeController($mdDialog, data, SpaceTypes) {
    var vm = this;

    vm.space_type_edit_in_progress = false;
    vm.space_type_edit_failed = false;
    vm.space_type_edit_failed_messages = [];

    vm.data = data;

    vm.editSpaceType = editSpaceType;
    vm.deleteSpaceType = deleteSpaceType;
    vm.cancel = cancel;

    function editSpaceType(data) {
      SpaceTypes.update(vm.data)
        .then(SpaceTypeEditSuccessFn, SpaceTypeEditErrorFn);

      vm.space_type_edit_in_progress = true;

      function SpaceTypeEditSuccessFn(response) {
        vm.space_type_edit_in_progress = false;
        $mdDialog.hide(data);
      }

      function SpaceTypeEditErrorFn(response) {
        vm.space_type_edit_failed = true;
        vm.space_type_edit_failed_messages = response.data;
        vm.space_type_edit_in_progress = false;
      }
    }

    function deleteSpaceType() {
      SpaceTypes.remove(vm.data)
        .then(SpaceTypeDeleteSuccessFn, SpaceTypeDeleteErrorFn);

      vm.space_type_edit_in_progress = true;

      function SpaceTypeDeleteSuccessFn(response) {
        vm.space_type_edit_in_progress = false;
        $mdDialog.hide(data);
      }

      function SpaceTypeDeleteErrorFn(response) {
        vm.space_type_edit_failed = true;
        vm.space_type_edit_failed_messages = response.data;
        vm.space_type_edit_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
