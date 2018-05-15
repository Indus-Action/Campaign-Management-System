(function() {
  'use strict';

  angular
    .module('vms2.forms.controllers')
    .controller('FormStudioController', FormStudioController);

  FormStudioController.inject = ['Forms', '$routeParams', '$location', 'Auth'];

  function FormStudioController(Forms, $routeParams, $location, Auth) {
    var vm = this;

    vm.formid = $routeParams.id;

    // Form details
    vm.form = {};
    vm.form.id = 0;
    vm.form.name = 'New Form';
    vm.form.description = "Custom form.";
    vm.form.fields = [];

    //Persistent form
    vm.persistent_form = {};

    // Preview duplicate form
    vm.previewform = {};

    // Duplicate Persistent form
    vm.preview_persistent_form = {};

    vm.is_admin = Auth.isAdmin();
    vm.isformlive = false;

    // New field object
    vm.newField = {};
    vm.newField.types = Forms.fields();
    vm.newField.selected = vm.newField.types[0].name;
    vm.newField.lastAddedID = 0;

    // Temporary field list
    vm.temp_form_fields = {};

    // Accordion Settings
    vm.accordion = {};
    vm.accordion.oneAtATime = true;

    vm.loadForm = function() {
      Forms.getPersistentForm()
        .then(getPersistentFormSuccessFn, getPersistentFormErrorFn);

      function getPersistentFormSuccessFn(response) {
        vm.persistent_form = response.data[0];
        vm.persistent_form.fields = response.data[0].schema;

        if(!vm.isNew()) {
          var temp_id = vm.formid;

          Forms.getOne(
            temp_id
          ).then(getFormSuccessFunction, getFormFailureFunction);

          function getFormSuccessFunction(response) {
            vm.form.id = response.data.id;
            vm.form.name = response.data.name;
            vm.form.description = response.data.description;
            vm.form.fields = response.data.schema;
            console.log("Form retrieved.");

            vm.preview();
          }
          function getFormFailureFunction() {
            $location.path('/forms/');
            console.log("Form retrieval failed.");
          }
        }
      }

      function getPersistentFormErrorFn(response) {
        console.log('Error while getting Persistent Form in FormStudioController');
      }
    };

    vm.saveForm = function() {
      Forms.savePersistentForm(vm.persistent_form)
        .then(persistentFormSaveSuccessFn);

      function persistentFormSaveSuccessFn(response) {
        if(!vm.isNew()) {
          Forms.save(
            vm.form
          ).then(saveFormSuccess, saveFormFailure);

          function saveFormSuccess() {
            console.log("Form saved.");
            vm.loadForm();
          }
          function saveFormFailure() {
            console.log("Form failed to save.");
          }
        }
        else {
          Forms.create(
            vm.form
          ).then(createFormSuccess, createFormFailure);

          function createFormSuccess(response) {
            console.log("Form created.");
            $location.path('/forms/studio/' + response.data.id + '/');
          }
          function createFormFailure() {
            console.log("Form failed to create.");
          }
        }
      }
    };

    vm.savePersistentForm = function () {
      Forms.savePersistentForm(vm.persistent_form)
        .then(savePersistentFormSuccessFn, savePersistentFormErrorFn);

      function savePersistentFormSuccessFn(response) {
        console.log('Persistent Form Saved');
        vm.persistent_form = response.data;
        vm.preview();
      }

      function savePersistentFormErrorFn(response) {
        console.log('Error while saving persistent form');
      }
    }

    vm.deleteForm = function() {
      Forms.deleteForm(
        vm.form.id
      ).then(deleteFormSuccess, deleteFormFailure);

      function deleteFormSuccess() {
        console.log('Form deleted.');
        //ToDo: Send to new location... Check this..
        $location.path('/forms/');
      }
      function deleteFormFailure() {
        console.log('Form deletion failed.');
      }
    };

    vm.isNew = function() {
      return vm.formid?false:true;
    };

    vm.goToFormList = function() {
      $location.path('/forms/');
    };

    vm.reset = function() {
      if(vm.isNew()){
        vm.form.fields.splice(0, vm.form.fields.length);
        vm.newField.lastAddedID = 0;
      } else {
        vm.loadForm();
      }
    };

    vm.preview = function() {
      angular.copy(vm.form, vm.previewform);
      angular.copy(vm.persistent_form, vm.preview_persistent_form);
    };

    vm.loadForm();
  }
})();
