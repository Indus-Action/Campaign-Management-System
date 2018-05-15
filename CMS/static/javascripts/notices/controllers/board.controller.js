(function () {
  'use strict';

  angular
    .module('vms2.notices.controllers')
    .controller('NoticeBoardController', NoticeBoardController);

  NoticeBoardController.$inject = ['Notices'];

  function NoticeBoardController(Notices) {
    var vm = this;

    activate();

    function activate() {
      Notices.all()
        .then(noticesAllSuccessFn, noticesAllErrorFn);

      function noticesAllSuccessFn(response) {
        vm.notices = response.data;
      }

      function noticesAllErrorFn(response) {
        console.log('Error while getting notices in NoticeBoardController');
      }
    }
  }
})();
