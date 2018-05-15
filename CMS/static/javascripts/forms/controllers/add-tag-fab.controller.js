(function () {
  'use strict';

  angular
    .module('vms2.forms.controllers')
    .controller('AddTagFabController', AddTagFabController);

  AddTagFabController.$inject = ['$filter', '$mdDialog', '$routeParams', 'Tags', 'Tasks','task'];

  function AddTagFabController($filter, $mdDialog, $routeParams, Tags, Tasks,task) {
    var vm = this;
   
    // Auto complete for tags
    vm.selected_tag = null;
    vm.tag_search_text = null;
    vm.querySearch = querySearch;
    vm.tags = [];
    vm.selected_tags = [];
    vm.available_tags = [];
    vm.beneficiary_tags = [];
    vm.transformChip = transformChip;
    vm.tagMatchRequired = true;
    vm.clearTagSearchTerm = clearTagSearchTerm;
    vm.addTags = addTags;
    vm.onSearchTagTextChange = onSearchTagTextChange;
    vm.cancel = cancel;
    vm.removeTag=removeTag;

    vm.are_tags_read_only = false;
    vm.search_tag_term = '';
    vm.add_tags_in_progress = false;

    activate();

    function activate() {
      var task_id = task.id;

      Tasks.get(task_id)
        .then(taskGetSuccessFn, taskGetErrorFn);

      Tags.allLight()
        .then(TagsAllSuccessFn, TagsAllErrorFn);

    }

    function transformChip(chip) {
      if (angular.isObject(chip)) {
        var tag = chip;

        Tags.addTag(vm.task.beneficiary, tag.id);

        return chip;
      }
    }

    function taskGetSuccessFn(response) {
      vm.task = response.data;

      Tags.allLightForUser(vm.task.beneficiary)
        .then(beneficiaryTagsGetSuccessFn, beneficiaryTagsGetErrorFn);
    }

    function taskGetErrorFn(response) {
      console.log('Error while getting task in AddTagFabController');
    }

    function beneficiaryTagsGetSuccessFn(response) {
      vm.add_tags_in_progress = false;
      vm.beneficiary_tags = response.data;
    }

    function beneficiaryTagsGetErrorFn(response) {
      console.log('Error while getting beneficiary tags in FormDataAddController');
    }

    function TagsAllSuccessFn(response) {
      vm.tags = response.data;
      vm.available_tags = response.data;
    }

    function TagsAllErrorFn(response) {
      console.log('Error while getting all tags in FormDataAddController');
    }

    function clearTagSearchTerm() {
      vm.search_tag_term = '';
    }

    function addTags() {
      Tags.addTags(vm.task.beneficiary, vm.selected_tags)
        .then(addTagsSuccessFn, addTagsErrorFn);

      vm.add_tags_in_progress = true;

      function addTagsSuccessFn(response) {
        Tags.allLightForUser(vm.task.beneficiary)
          .then(beneficiaryTagsGetSuccessFn, beneficiaryTagsGetErrorFn);
      }

      function addTagsErrorFn(response) {
        vm.add_tags_in_progress = false;
        console.log('Error while adding tags in AddTagFabController');
      }
    }

    function onSearchTagTextChange($event) {
      $event.stopPropagation();

      vm.available_tags = $filter('filter')(vm.tags, {$: vm.search_tag_term});
    }

    function querySearch (query) {
      var results = query ? vm.tags.filter(createFilterFor(query)) : [];

      return results;
    }

    function createFilterFor(query) {
      var lowercaseQuery = angular.lowercase(query);

      return function filterFn(tag) {
        return (angular.lowercase(tag.tag).indexOf(lowercaseQuery) === 0) ||
          (angular.lowercase(tag.desc).indexOf(lowercaseQuery) === 0);
      };

    }

    function removeTag(chip)
    {
      var tag=chip;
      Tags.removeUserFromTag(vm.task.beneficiary, tag.id).then(removeTagsSuccessFn, removeTagsErrorFn);
      vm.add_tags_in_progress = true;

      function removeTagsSuccessFn(response)
      {
        Tags.allLightForUser(vm.task.beneficiary)
          .then(beneficiaryTagsGetSuccessFn, beneficiaryTagsGetErrorFn);


      }

       function removeTagsErrorFn(response) {
        vm.add_tags_in_progress = false;
        console.log('Error while adding tags in AddTagFabController');
      }

      

    }

    function cancel() {
      $mdDialog.cancel();
    }
  }
})();
