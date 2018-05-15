(function () {
  'use strict';

  angular
    .module('vms2.interests.controllers')
    .controller('NewInterestController', NewInterestController);

  NewInterestController.$inject = ['Interests', '$mdDialog', '$filter'];

  function NewInterestController(Interests, $mdDialog, $filter) {
    var vm = this;

    vm.interest_creation_in_progress = false;
    vm.interest_creation_failed = false;
    vm.interest_creation_failed_messages = [];

    vm.data = {};

    vm.createNewInterest = createNewInterest;
    vm.cancel = cancel;

    vm.tags = [];

    activate();

    function activate() {
      Interests.all()
        .then(interestsGetSuccessFn, interestsGetErrorFn);

      function interestsGetSuccessFn(response) {
        vm.interests = response.data;
      }

      function interestsGetErrorFn(response) {
        console.log('Error while getting interests in NewInterestController');
      }
    }

    function createNewInterest() {
      Interests.create(vm.data)
        .then(interestCreateSuccessFn, interestCreateErrorFn);

      vm.interest_creation_in_progress = true;

      function interestCreateSuccessFn(response) {
        vm.interest_creation_in_progress = false;
        $mdDialog.hide(response.data);
      }

      function interestCreateErrorFn(response) {
        vm.interest_creation_failed = true;
        vm.interest_creation_failed_messages = response.data;
        vm.interest_creation_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
