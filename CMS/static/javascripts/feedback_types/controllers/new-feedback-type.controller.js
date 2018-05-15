(function () {
  'use strict';

  angular
    .module('vms2.feedback_types.controllers')
    .controller('NewFeedbackTypeController', NewFeedbackTypeController);

  NewFeedbackTypeController.$inject = ['FeedbackTypes'];

  function NewFeedbackTypeController(FeedbackTypes) {
    var vm = this;

    vm.data = {};

    vm.submit = submit();

    function submit() {
      FeedbackTypes.create(vm.data)
        .then(FeedbackTypeCreateSuccessFn, FeedbackTypeCreateErrorFn);

      function FeedbackTypeCreateSuccessFn(data, status, headers, config) {
        console.log('New Feedback Type created successfully');
      }

      function FeedbackTypeCreateErrorFn(data, status, headers, config) {
        console.log('Error while creating New Feedback Type');
      }
    }
  }
})();
