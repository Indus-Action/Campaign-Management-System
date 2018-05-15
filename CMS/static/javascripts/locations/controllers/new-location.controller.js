(function () {
  'use strict';

  angular
    .module('vms2.locations.controllers')
    .controller('NewLocationController', NewLocationController);

  NewLocationController.$inject = ['$scope'];

  function NewLocationController($scope) {
    var vm = this;

    vm.content = "";

    vm.submit = submit;

    function submit() {
      vm.content = "content";

      console.log("asaadasd");

      $scope.closeThisDialog();
    }
  }
})();
