(function() {
  'use strict';

  angular
    .module('vms2.forms.controllers')
    .controller('FormsController', FormsController);

  FormsController.inject = ['Forms', '$location', 'Auth'];

  function FormsController(Forms, $location, Auth) {
    var vm = this;

    vm.is_admin = Auth.isAdmin();
    vm.forms = [];
    
    vm.getFormsList = function() {
      Forms.get().then(getFormsSuccess, getFormsFailure);

      function getFormsSuccess(response) {
        vm.forms = response.data;
        console.log("Form list retrieved.");
      }
      function getFormsFailure() {
        console.log("Form list retrieval failed.");
      }
    };

    vm.createForm = function() {
      $location.path('/forms/studio/');
    };

    vm.deleteForm = function(form_id) {
      Forms.deleteForm(
        form_id
      ).then(deleteFormSuccess, deleteFormFailure);
      
      function deleteFormSuccess() {
        console.log('Form deleted.');
        vm.getFormsList();
      }
      function deleteFormFailure() {
        console.log('Form deletion failed.');
      }
    };
    
    vm.editForm = function(form_id) {
      $location.path('/forms/studio/' + form_id + '/');
    };

    vm.getData = function(form_id) {
      $location.path('/forms/' + form_id + '/data');
    };

    vm.addData = function(form_id) {
      $location.path('/forms/' + form_id + '/data/add');
    };

    vm.getFormsList();
  }
})();
