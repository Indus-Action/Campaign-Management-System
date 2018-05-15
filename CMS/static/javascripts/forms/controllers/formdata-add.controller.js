(function() {
  'use strict';

  angular
    .module('vms2.forms.controllers')
    .controller('FormDataAddController', FormDataAddController);

  FormDataAddController.$inject = ['$location', '$mdDialog', '$mdMedia', '$mdSidenav',
                                   '$q', '$routeParams', '$scope', 'Auth', 'Calls', 'Forms', 'IVRs', 'Locations',
                                   'Messages', 'Notes', 'Todos', 'Tags', 'Tasks', 'TaskTypes', 'TrainingKit'];

  function FormDataAddController($location, $mdDialog, $mdMedia, $mdSidenav, $q,
                                 $routeParams, $scope, Auth, Calls, Forms, IVRs, Locations,
                                 Messages, Notes, Todos, Tags, Tasks, TaskTypes, TrainingKit) {
    var vm = this;

    vm.form = {};
    vm.form.id = 0;
    vm.form.name = "New Form";
    vm.form.description = "Custom form.";
    vm.form.fields = [];
    vm.form.data = {};

    vm.submit_data = {};

    vm.beneficiary_notes = [];
    vm.beneficiary_messages = [];
    vm.beneficiary_todos = [];

    vm.view_form = {};
    vm.persistent_form = {};

    vm.isformlive = true;

    vm.task = null;
    vm.task_type = null;
    vm.is_fab_open = false;
    vm.is_current_call_active = Calls.$current_call ? true : false;
    vm.show_persistent = true;
    vm.beneficiary_form=null;

    vm.closeSidenav = closeSidenav;
    vm.end_call = end_call;
    vm.formRender = formRender;
    vm.isSidenavOpen = isSidenavOpen;
    vm.resetForm = resetForm;
    vm.getForm = getForm;
    vm.getData = getData;
    vm.openSidenav = openSidenav;
    vm.openSendMessagePopup = openSendMessagePopup;
    vm.openSendIVRPopup = openSendIVRPopup;
    vm.openAddNotePopup = openAddNotePopup;
    vm.openAddTagPopup = openAddTagPopup;
    vm.openChangeStagePopup = openChangeStagePopup;
    vm.openChangeStatusPopup = openChangeStatusPopup;
    vm.showTrainingKit = showTrainingKit;

    vm.openGiveBeneficiaryRatingPopup = openGiveBeneficiaryRatingPopup;

    vm.submitForm = submitForm;

    activate();

    function activate() {
      var task_id = $routeParams.task_id;

      vm.getForm();

      Tasks.get(task_id)
        .then(taskGetSuccessFn, taskGetErrorFn);

      function taskGetSuccessFn(data) {
        vm.task = data.data;
        vm.beneficiary_form=vm.task.beneficiary;
        
        if (!vm.task.beneficiary) {
          vm.show_persistent = false;
        }

        Auth.getUser(vm.task.beneficiary)
          .then(getBeneficiarySuccessFn, getBeneficiaryErrorFn);

        Notes.getBeneficiaryNotes(vm.task.beneficiary)
          .then(beneficiaryNotesGetSuccessFn, beneficiaryNotesGetErrorFn);

        Messages.getBeneficiaryMessages(vm.task.beneficiary)
          .then(beneficiaryMessagesGetSuccessFn, beneficiaryMessagesGetErrorFn);

        IVRs.getBeneficiaryIVRs(vm.task.beneficiary)
          .then(beneficiaryIVRsGetSuccessFn, beneficiaryIVRsGetErrorFn);

        Todos.getBeneficiaryTodos(vm.task.beneficiary)
          .then(beneficiaryTodosGetSuccessFn, beneficiaryTodosGetErrorFn);

        TaskTypes.get(vm.task.task_type)
          .then(taskTypeGetSuccessFn, taskTypeGetErrorFn);

        /*Forms.getPersistentForm()
          .then(getPersistentFormSuccessFn, getPersistentFormErrorFn);*/
      }

      function getBeneficiarySuccessFn(response) {
        vm.beneficiary = response.data;
      }

      function getBeneficiaryErrorFn(response) {
        console.log('Error while getting beneficiary in FormDataAddController');
      }

      function taskTypeGetSuccessFn(response) {
        vm.task_type = response.data;
      }

      function taskTypeGetErrorFn(response) {
        console.log('Error while getting task type in FormDataAddController');
      }

      function taskGetErrorFn(data) {
        $location.path('/forms/');
        console.log("Form retrieval failed");
      }

      function getPersistentFormSuccessFn(response) {
        vm.persistent_form = response.data[0];
        vm.persistent_form.fields = vm.persistent_form.schema;

        Forms.getPersistentData(vm.task.beneficiary)
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

      function getPersistentFormErrorFn(response) {
        console.log('Error while getting persistent form');
      }
    }

    function beneficiaryNotesGetSuccessFn(response) {
      vm.beneficiary_notes = response.data;
    }

    function beneficiaryNotesGetErrorFn(response) {
      console.log('Error while getting beneficiary notes in FormDataAddController');
    }

    function beneficiaryMessagesGetSuccessFn(response) {
      vm.beneficiary_messages = response.data;
    }

    function beneficiaryMessagesGetErrorFn(response) {
      console.log('Error while getting beneficiary messages in FormDataAddController');
    }

    function beneficiaryIVRsGetSuccessFn(response) {
      vm.beneficiary_ivrs = response.data;
    }

    function beneficiaryIVRsGetErrorFn(response) {
      console.log('Error while getting beneficiary IVRs in FormDataAddController');
    }

    function beneficiaryTodosGetSuccessFn(response) {
      vm.beneficiary_todos = response.data;
    }

    function beneficiaryTodosGetErrorFn(response) {
      console.log('Error while getting beneficiary todos in FormDataAddController');
    }

    function openSidenav() {
      $mdSidenav('left').open();
    }

    function closeSidenav() {
      $mdSidenav('left').close();
    }

    function end_call(ev) {
      var call = Calls.$current_call;

      if (call) {
        call.end = true;

        Calls.update(call)
          .then(endCallSuccessFn, endCallErrorFn);

      }

      function endCallSuccessFn(response) {
        Calls.$current_call = null;

       
        vm.openGiveBeneficiaryRatingPopup(ev);
      }

      function endCallErrorFn(response) {
        console.log('End call Error in FormDataAddController');
      }




    }

    function openGiveBeneficiaryRatingPopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {task: vm.task},
        controller: 'BeneficiaryRatingController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/forms/give-beneficiary-rating.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:false,
        fullscreen: use_full_screen
      }).then(function(task) {
        console.log("Given Beneficiary Rating");
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function openSendMessagePopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {task: vm.task},
        controller: 'NewMessageFabController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/user_messages/new-message.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(message) {
        Messages.getBeneficiaryMessages(vm.task.beneficiary)
          .then(beneficiaryMessagesGetSuccessFn, beneficiaryNotesGetErrorFn);
      }, function() {
        console.log("this asdasdasd");
      });

      $scope.$watch(function() {
        return $mdMedia('xs') || $mdMedia('sm');
      }, function(wantsFullScreen) {
        $scope.customFullscreen = (wantsFullScreen === true);
      });
    }

    function openSendIVRPopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {task: vm.task},
        controller: 'NewIVRFabController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/ivrs/new-ivr.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(ivr) {
        IVRs.getBeneficiaryIVRs(vm.task.beneficiary)
          .then(beneficiaryIVRsGetSuccessFn, beneficiaryIVRsGetErrorFn);
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function openAddNotePopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {task: vm.task},
        controller: 'NewNoteFabController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/notes/new-note.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(note) {
        Notes.getBeneficiaryNotes(vm.task.beneficiary)
          .then(beneficiaryNotesGetSuccessFn, beneficiaryNotesGetErrorFn);
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function openAddTagPopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {task: vm.task},
        controller: 'AddTagFabController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/tags/add-tag.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(tag) {
        console.log('Tag added', tag);
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function openChangeStatusPopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {task: vm.task},
        controller: 'ChangeStatusFabController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/task_status/change-status.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(status) {
        console.log('Status Changed', status);
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function openChangeStagePopup(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {user: vm.task.beneficiary,task:vm.task.id},
        controller: 'ChangeStageFabController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/stages/change-stage.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(data) {
      
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function getForm() {
      if($routeParams.form_id) {
        var temp_id = $routeParams.form_id,
            task_id = $routeParams.task_id;

        Forms.getOne(
          temp_id
        ).then(getFormSuccessFunction, getFormFailureFunction);


        function getFormSuccessFunction(response) {
          vm.form.id = response.data.id;
          vm.form.name = response.data.name;
          vm.form.description = response.data.description;
          vm.form.fields = response.data.schema;
          console.log("Form retrieved");
          vm.formRender();
          vm.getData();
        }

        function getFormFailureFunction() {
          $location.path('/forms/');
          console.log("Form retrieval failed");
        }
      }
      else {
        $location.path('/forms/');
      }
    };

    function getData() {
      if($routeParams.data_id) {
        Forms.getFormData(
          $routeParams.data_id
        ).then(getDataSuccess, getDataFailure);

        function getDataSuccess(response) {
          var ser_data = response.data.data,
              async_fields = [],
              async_requests = [];
          console.log("Form data retrieved.");

          deserializeForm(vm.view_form, ser_data);

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
                  if(form.fields[i].multiple && (data[form.fields[i].title] instanceof Array )) {
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
        function getDataFailure() {
          console.log("Form data retrieval failed.");
        }
      }
    };

    function isSidenavOpen() {
      return $mdSidenav('left').isOpen();
    }

    function showTrainingKit(ev) {
      var use_full_screen = ($mdMedia('sm') || $mdMedia('xs'))
          && $scope.customFullscreen;

      $mdDialog.show({
        locals: {training_kit: vm.task_type.training_kit},
        controller: 'OpenTrainingKitController',
        controllerAs: 'vm',
        templateUrl: '/static/templates/trainingkits/kitshowcase.html',
        parent: angular.element(document.body),
        targetEvent: ev,
        clickOutsideToClose:true,
        fullscreen: use_full_screen
      }).then(function(note) {
        console.log('Tag added', note);
      }, function() {
        console.log("this asdasdasd");
      });
    }

    function submitForm(form) {
      var data = {},
          async_fields = [],
          async_requests = [];

      data = serializeForm(form);

      vm.submit_data = data;

      function serializeForm(form) {
        var nested_data = {};
        for (var i in form.fields) {
          if (form.fields[i].type == "location") {
            async_fields.push(form.fields[i]);
            async_requests.push(Locations.create(form.fields[i].value));
          } else if (form.fields[i].type == "date") {
            var temp_date = new Date(form.fields[i].value);
            form.fields[i].value = new Date(
              Date.UTC(
                temp_date.getFullYear(),
                temp_date.getMonth(),
                temp_date.getDate()
              )
            );
            nested_data[form.fields[i].title] = form.fields[i].value;
          } else if (form.fields[i].type == "nestedfield") {
            if(!(form.fields[i].fields instanceof Array)) {
              nested_data[form.fields[i].fields.name] = serializeForm(form.fields[i].fields);
            } else {
              var temp_data = [];
              for (var k in form.fields[i].fields) {
                temp_data.push(serializeForm(form.fields[i].fields[k]));
              }
              if (form.fields[i].fields.length) {
                nested_data[form.fields[i].fields[0].name] = temp_data;
              } else {
                nested_data['NA'] = temp_data;
              }
            }
          } else if (form.fields[i].type == "submitbutton") {
            // Do nothing..
          } else {
            nested_data[form.fields[i].title] = form.fields[i].value;
            if (form.fields[i].type == "user") {
              Auth.addAltMobileToUser(
                vm.task.beneficiary,
                form.fields[i].value
              ).then(addAltMobileToUserSuccess, addAltMobileToUserFailure);
              function addAltMobileToUserSuccess(response) {
                console.log("Alternate mobile number added successfully.");
              }
              function addAltMobileToUserFailure() {
                console.log("Failed to add alternate mobile number to user.");
              }
            }
          }
        }
        return nested_data;
      }

      $q.all(async_requests).then(onAllRequestsResolved);

      function onAllRequestsResolved(responses) {
        for (var i in responses) {
          data[async_fields[i].title] = responses[i].data.id;
        }
        if($routeParams.data_id || form.persistent) {
          if (!form.persistent) {
            Forms.updateFormData(
              $routeParams.data_id,
              $routeParams.form_id,
              vm.beneficiary_form,
              data
            ).then(updateDataSuccess, updateDataFailure);
          } else {
            Forms.updateFormData(
              vm.persistent_data.id,
              vm.persistent_form.id,
              data
            ).then(updateDataSuccess, updateDataFailure);
          }

          function updateDataSuccess() {
            console.log("Data updated successfully.");
          }
          function updateDataFailure() {
            console.log("Data update failed.");
          }
        } else {
          Forms.submitFormData(
            vm.view_form.id,
            vm.beneficiary_form,
            data
          ).then(submitFormSuccess, submitFormFailure);

          function submitFormSuccess(response) {
            vm.task.form_data = response.data.id;

            Tasks.update(vm.task)
              .then(TaskUpdateSuccessFn, TaskUpdateErrorFn);

            function TaskUpdateSuccessFn(data) {
              console.log('Task Update Successful');
            }

            function TaskUpdateErrorFn(data) {
              console.log("Form submission failed.");
            }
          }

          function submitFormFailure() {
            console.log("Form submission failed.");
          }
        }
      }
    };

    function formRender() {
      angular.copy(vm.form, vm.view_form);
    };

    function resetForm() {
      if($routeParams.data_id) {
        vm.getData();
      } else {
        vm.formRender();
      }
    };
  }
})();
