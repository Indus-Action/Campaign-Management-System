(function () {
  'use strict';

  angular
    .module('vms2.trainingkits.controllers')
    .controller('PageContentEditController', PageContentEditController);

  PageContentEditController.inject = ['$mdMedia', '$mdDialog', '$scope', 'TrainingKit', 'PageID'];

  function PageContentEditController($mdMedia, $mdDialog, $scope, TrainingKit, PageID) {
    
    var vm = this;
    vm.page = {};
    vm.page.id = PageID;
    vm.kit_id = -1;
    vm.loading = false;
    vm.pagetypes = {};
    vm.temp_content_file_list = [];
    vm.upload_inconsistent = false;

    vm.getPageTypes = getPageTypes;
    vm.getPageData = getPageData;
    vm.savePage = savePage;
    vm.deletePageFile = deletePageFile;
    vm.cancel = cancel;
    vm.hide = hide;

    var uploader = $scope.uploader = TrainingKit.pageFilesUploader(
      vm.page.id
    );

    activate();

    function activate() {
      vm.getPageTypes();
      vm.getPageData();
    }

    function getPageTypes() {
      TrainingKit.getPageTypes().then(getPageTypesSuccess, getPageTypesFailure);

      function getPageTypesSuccess(response) {
        vm.pagetypes = response.data;
        console.log("Page types retrieved.");
      }
      function getPageTypesFailure() {
        console.log("Page types retrieval failed.");
      }
    }
    
    function getPageData() {
      vm.loading = true;

      TrainingKit.getPage(
        vm.page.id
      ).then(getPageSuccess, getPageFailure);

      function getPageSuccess(response) {
        vm.loading = false;
        vm.page = response.data;
        if(vm.page.content_type != 'TXT') {
          try {
            vm.temp_content_file_list = [];
            var temp_file_array = angular.fromJson(vm.page.content);
            for (var i in temp_file_array) {
              var temp_file = {
                'filename' : temp_file_array[i]
              };
              vm.temp_content_file_list.push(temp_file);
            }
          } catch (e) {
            // Do nothing.
          }
        }
        vm.kit_id = response.data.kit;
        console.log("Page retrieved.");
      }
      function getPageFailure() {
        vm.loading = false;
        console.log("Page retrieval failed;");
      }
    }

    function savePage() {
      vm.loading = true;

      if(vm.page.content_type != 'TXT') {
        try {
          var temp_file_array = [];
          for (var i in vm.temp_content_file_list) {
            temp_file_array.push(vm.temp_content_file_list[i].filename);
          }
          vm.page.content = angular.toJson(temp_file_array);
        } catch (e) {
          // Do nothing.
        }
      }

      TrainingKit.updatePage(
        vm.page.id,
        vm.kit_id,
        vm.page
      ).then(pageSaveSuccess, pageSaveFailure);

      function pageSaveSuccess() {
        vm.loading = false;
        vm.upload_inconsistent = false;
        console.log("Page info saved.");
        vm.hide(vm.page);
      }
      function pageSaveFailure() {
        vm.loading = false;
        console.log("Page failed to save.");
      }
    }

    function deletePageFile(index) {
      vm.loading = true;

      TrainingKit.pageFileDelete(
        vm.temp_content_file_list[index].filename
      ).then(fileDeleteSuccess, fileDeleteFailure);

      function fileDeleteSuccess() {
        vm.loading = false;
        vm.temp_content_file_list.splice(index, 1);
        vm.upload_inconsistent = true;
        console.log("File deleted.");
      }
      function fileDeleteFailure() {
        vm.loading = false;
        console.log("File deletion failed.");
      }
    }

    function cancel(data, ev) {
      if(vm.upload_inconsistent) {
        alert('You must save the form to avoid inconsistent state.')
      } else {
        $mdDialog.cancel(data);
      }
    }

    function hide(data) {
      $mdDialog.hide(data);
    }

    uploader.onWhenAddingFileFailed = onWhenAddingFileFailed;
    uploader.onAfterAddingFile = onAfterAddingFile;
    uploader.onAfterAddingAll = onAfterAddingAll;
    uploader.onBeforeUploadItem = onBeforeUploadItem;
    uploader.onProgressItem = onProgressItem;
    uploader.onProgressAll = onProgressAll;
    uploader.onSuccessItem = onSuccessItem;
    uploader.onErrorItem = onErrorItem;
    uploader.onCancelItem = onCancelItem;
    uploader.onCompleteItem = onCompleteItem;
    uploader.onCompleteAll = onCompleteAll;
    
    function onWhenAddingFileFailed(item /*{File|FileLikeObject}*/, filter, options) {
      console.info('onWhenAddingFileFailed', item, filter, options);
    }
    function onAfterAddingFile(fileItem) {
      console.info('onAfterAddingFile', fileItem);
    }
    function onAfterAddingAll(addedFileItems) {
      console.info('onAfterAddingAll', addedFileItems);
    }
    function onBeforeUploadItem(item) {
      console.info('onBeforeUploadItem', item);
    }
    function onProgressItem(fileItem, progress) {
      console.info('onProgressItem', fileItem, progress);
    }
    function onProgressAll(progress) {
      console.info('onProgressAll', progress);
    }
    function onSuccessItem(fileItem, response, status, headers) {
      console.info('onSuccessItem', fileItem, response, status, headers);

      var temp_file_item = {
        'filename' : response.pub_filepath
      };
      vm.temp_content_file_list.push(temp_file_item);

      vm.upload_inconsistent = true;
    }
    function onErrorItem(fileItem, response, status, headers) {
      console.info('onErrorItem', fileItem, response, status, headers);
    }
    function onCancelItem(fileItem, response, status, headers) {
      console.info('onCancelItem', fileItem, response, status, headers);
    }
    function onCompleteItem(fileItem, response, status, headers) {
      console.info('onCompleteItem', fileItem, response, status, headers);
    }
    function onCompleteAll() {
      console.info('onCompleteAll');
    }
  }
})();
