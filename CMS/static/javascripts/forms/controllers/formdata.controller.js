(function() {
  'use strict';

  angular
    .module('vms2.forms.controllers')
    .controller('FormDataController', FormDataController);

  FormDataController.inject = ['Forms', '$routeParams', '$location'];

  function FormDataController(Forms, $routeParams, $location) {
    var vm = this;

    vm.form = {};
    vm.form.id = 0;
    vm.form.name = "New Form";
    vm.form.description = "Description";
    vm.form.fields = [];

    vm.form_data = [];

    vm.getForm = function() {
      Forms.getOne(
        $routeParams.id
      ).then(getFormSuccessFunction, getFormFailureFunction);

      function getFormSuccessFunction(response) {
        vm.form.id= response.data.id;
        vm.form.name = response.data.name;
        vm.form.description = response.data.description;
        vm.form.fields = response.data.schema;
        console.log("Form retrieved");
        vm.getFormData();
      }
      function getFormFailureFunction() {
        $location.path('/forms/');
        console.log("Form retrieval failed.");
      }
    };

    vm.getFormData = function() {
      Forms.getFormDataList(
        $routeParams.id
      ).then(getFormDataSuccess, getFormDataFailure);

      function getFormDataSuccess(response) {
        vm.form_data = response.data;
        console.log("Form data retrieved.");
      }
      function getFormDataFailure() {
        console.log("Form data retrieval failed.");
      }
    };

    vm.deleteFormData = function(id) {
      Forms.deleteFormData(
        id
      ).then(deleteFormDataSuccess, deleteFormDataFailure);

      function deleteFormDataSuccess(response) {
        vm.getFormData();
        console.log("Form data deleted.");
      }
      function deleteFormDataFailure() {
        console.log("Form data deletion failed.");
      }
    };

    vm.fillForm = function() {
      $location.path('/forms/' + vm.form.id + '/data/add');
    };

    vm.editFormData = function(data_id) {
      $location.path('/forms/' + vm.form.id + '/data/add/' + data_id);
    };

    vm.getForm();
  }
})();
