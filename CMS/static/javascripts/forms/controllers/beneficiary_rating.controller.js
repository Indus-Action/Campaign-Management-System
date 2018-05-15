(function () {
  'use strict';

  angular
    .module('vms2.forms.controllers')
    .controller('BeneficiaryRatingController', BeneficiaryRatingController);

  BeneficiaryRatingController.$inject = ['$mdDialog', 'Tasks', 'task'];

  function BeneficiaryRatingController($mdDialog, Tasks, task) {
    var vm = this;

    vm.beneficiary_rating = 1;
    vm.task = task

    vm.giveBeneficiaryRating = giveBeneficiaryRating;

    function giveBeneficiaryRating() {
      vm.task.beneficiary_rating = vm.beneficiary_rating;

      Tasks.update(vm.task)
        .then(taskUpdateSuccessFn, taskUpdateErrorFn);

      function taskUpdateSuccessFn(response) {
        $mdDialog.hide(response.data);
        window.history.back();
      }

      function taskUpdateErrorFn(response) {
        console.log('Error while giving beneficiary rating in BeneficiaryRatingController');
        $mdDialog.hide(response.data);
        window.history.back();
      }
    }
  }
})();
