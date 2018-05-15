(function () {
  'use strict';

  angular
    .module('vms2.layout.controllers')
    .controller('IndexController', IndexController);

  function IndexController($scope) {
    var vm = this;

    vm.content = "Hello Content";

    function submit() {
      console.log("here");
    }
  }
})();
