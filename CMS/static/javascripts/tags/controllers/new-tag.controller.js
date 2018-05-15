(function () {
  'use strict';

  angular
    .module('vms2.tags.controllers')
    .controller('NewTagController', NewTagController);

  NewTagController.$inject = ['Tags', '$mdDialog', '$filter'];

  function NewTagController(Tags, $mdDialog, $filter) {
    var vm = this;

    vm.tag_creation_in_progress = false;
    vm.tag_creation_failed = false;
    vm.tag_creation_failed_messages = [];

    vm.data = {};
    vm.data.exclusive_tags = [];

    vm.createNewTag = createNewTag;
    vm.cancel = cancel;
    vm.onSearchTextChange = onSearchTextChange;

    vm.tags = [];
    vm.available_tags = [];
    vm.search_term = '';
    vm.clearSearchTerm = function() {
      vm.search_term = '';
    };

    activate();

    function activate() {
      Tags.all()
        .then(tagsGetSuccessFn, tagsGetErrorFn);

      function tagsGetSuccessFn(data, status, headers, config) {
        vm.tags = data.data;
        vm.available_tags = data.data;
      }

      function tagsGetErrorFn(data, status, headers, config) {
        console.log('Error while getting tags in NewTagController');
      }
    }

    function onSearchTextChange($event) {
      $event.stopPropagation();

      vm.available_tags = $filter('filter')(vm.tags, {tag: vm.search_term});
    }

    function createNewTag() {
      Tags.create(vm.data)
        .then(tagCreateSuccessFn, tagCreateErrorFn);

      vm.tag_creation_in_progress = true;

      function tagCreateSuccessFn(data, status, headers, config) {
        vm.tag_creation_in_progress = false;
        $mdDialog.hide(data.data);
      }

      function tagCreateErrorFn(data, status, headers, config) {
        vm.tag_creation_failed = true;
        vm.tag_creation_failed_messages = data.data;
        vm.tag_creation_in_progress = false;
      }
    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
