(function () {
  'use strict';

  angular
    .module('vms2.auth.controllers')
    .controller('UserDetailController', UserDetailController);

  UserDetailController.$inject = ['$routeParams', 'Auth', 'Forms', 'Locations', 'Messages', 'Notes', 'Stages', 'Tasks', 'Todos'];

  function UserDetailController($routeParams, Auth, Forms, Locations, Messages, Notes, Stages, Tasks, Todos) {
    var vm = this;

    vm.user = null;

    vm.beneficiary_notes = [];
    vm.beneficiary_messages = [];
    vm.beneficiary_todos = [];

    vm.beneficiary_tasks = [];
    vm.assigned_tasks = [];

    vm.persistent_form = {};
    vm.isformlive = false;

    activate();

    function activate() {
      var user_id = $routeParams.id;

      Auth.getUser(user_id)
        .then(userGetSuccessFn, userGetErrorFn);

      function userGetSuccessFn(data, status, headers, config) {
        vm.user = data.data;

        Tasks.getBeneficiaryTasks(vm.user.id)
          .then(beneficiaryTasksGetSuccessFn, beneficiaryTasksGetErrorFn);

        Tasks.getAssignedTasks(vm.user.id)
          .then(assignedTasksGetSuccessFn, assignedTasksGetErrorFn);

        Notes.getBeneficiaryNotes(vm.user.id)
          .then(beneficiaryNotesGetSuccessFn, beneficiaryNotesGetErrorFn);

        Messages.getBeneficiaryMessages(vm.user.id)
          .then(beneficiaryMessagesGetSuccessFn, beneficiaryMessagesGetErrorFn);

        Todos.getBeneficiaryTodos(vm.user.id)
          .then(beneficiaryTodosGetSuccessFn, beneficiaryTodosGetErrorFn);

        Forms.getPersistentForm()
          .then(persistentFormGetSuccessFn, persistentFormGetErrorFn);
      }

      function beneficiaryTasksGetSuccessFn(data, status, headers, config) {
        vm.beneficiary_tasks = data.data;
      }

      function beneficiaryTasksGetErrorFn(data, status, headers, config) {
        console.log('Error while getting beneficiary tasks')
      }

      function assignedTasksGetSuccessFn(data, status, headers, config) {
        vm.assigned_tasks = data.data;
      }

      function assignedTasksGetErrorFn(data, status, headers, config) {
        console.log('Error while getting assigned tasks');
      }

      function userGetErrorFn(data, status, headers, config) {
        console.log('Error while getting beneficiary in UserDetailController');
      }

      function beneficiaryNotesGetSuccessFn(data, status, headers, config) {
        vm.beneficiary_notes = data.data;
      }

      function beneficiaryNotesGetErrorFn(data, status, headers, config){
        console.log('Error while getting beneficiary notes in UserDetailController');
      }

      function beneficiaryMessagesGetSuccessFn(data, status, headers, config) {
        vm.beneficiary_messages = data.data;
      }

      function beneficiaryMessagesGetErrorFn(data, status, headers, config) {
        console.log('Error while getting beneficiary messages in UserDetailController');
      }

      function beneficiaryTodosGetSuccessFn(data, status, headers, config) {
        vm.beneficiary_todos = data.data;
      }

      function beneficiaryTodosGetErrorFn(data, status, headers, config) {
        console.log('Error while getting beneficiary todos in UserDetailController');
      }

      function persistentFormGetSuccessFn(response) {
        vm.persistent_form = response.data[0];
        vm.persistent_form.fields = vm.persistent_form.schema;

        Forms.getPersistentData(vm.user.id)
          .then(persistentDataGetSuccessFn, persistentDataGetErrorFn);

        function persistentDataGetSuccessFn(response) {
          vm.persistent_data = response.data;
          var ser_data = response.data.data,
              async_fields = [],
              async_requests = [];
          console.log("Form data retrieved.");

          deserializeForm(vm.persistent_form, ser_data);

          function deserializeForm(form, data) {
            for (var i in form.fields) {
              if (form.fields[i].type == "location") {
                form.fields[i].value = {};
                async_fields.push(form.fields[i]);
                async_requests.push(Locations.get(data[form.fields[i].title]));
              } else if (form.fields[i].type == "date") {
                if (form.fields[i].multiple) {
                  form.fields[i].value = [];
                  for (var k in data[form.fields[i].title]) {
                    var temp_date = new Date(data[form.fields[i].title][k]);
                    form.fields[i].value.push(new Date (
                      Date.UTC (
                        temp_date.getFullYear(),
                        temp_date.getMonth(),
                        temp_date.getDate()
                      )
                    ));
                  }
                } else {
                  var temp_date = new Date(data[form.fields[i].title]);
                  form.fields[i].value = new Date (
                    Date.UTC (
                      temp_date.getFullYear(),
                      temp_date.getMonth(),
                      temp_date.getDate()
                    )
                  );
                }
              } else if (form.fields[i].type == "nestedfield") {
                if(!(form.fields[i].fields instanceof Array)) {
                  deserializeForm(form.fields[i].fields, data[form.fields[i].fields.name]);
                } else {
                  if(form.fields[i].multiple) {
                    var tempfieldvalue = form.fields[i].fields[0];
                    form.fields[i].fields = [];
                    for (var j in data[tempfieldvalue.name]) {
                      form.fields[i].fields.push(angular.copy(tempfieldvalue));
                    }
                    for (var j in data[tempfieldvalue.name]) {
                      for (var k in form.fields[i].fields) {
                        deserializeForm(form.fields[i].fields[k], data[tempfieldvalue.name][k]);
                      }
                    }
                  } else {
                    for (var k in form.fields[i].fields) {
                      deserializeForm(form.fields[i].fields[k], data[form.fields[i].fields[k].name]);
                    }
                  }
                }
              } else {
                if (form.fields[i].multiple) {
                  var tempfieldvalues = [];
                  for (var k in data[form.fields[i].title]) {
                    tempfieldvalues.push(data[form.fields[i].title][k]);
                  }
                  form.fields[i].value = tempfieldvalues;
                } else {
                  form.fields[i].value = data[form.fields[i].title];
                }
              }
            }
          }

          $q.all(async_requests).then(onAllRequestsResolved);
          function onAllRequestsResolved(responses) {
            for (var i in responses) {
              async_fields[i].value = responses[i].data;
            }
          }

          console.log("Data parsed for forms.");
        }

        function persistentDataGetErrorFn(response) {
          console.log('Error while getting persistent data in FormDataAddController');
        }
      }

      function persistentFormGetErrorFn(response) {
        console.log('Error while getting persistent form in UserDetailController');
      }
    }
  }
})();
