(function () {
  'use strict';

  angular
    .module('vms2.forms.controllers')
    .controller('FormEditorController', FormEditorController);

  FormEditorController.$inject = ['$scope', 'Auth', 'Forms'];
  function FormEditorController($scope, Auth, Forms) {
    var vm = this;

    var WITH_OPTIONS_FIELDS = ["radio", "dropdown", "autocomplete"];
    var NO_DEFAULTS_FIELDS = ["nestedfield"];
    var NO_REQUIRED_BUTTON_FIELDS = ["submitbutton"];
    var NO_MULTIPLE_BUTTON_FIELDS = ["location", "submitbutton"];

    vm.formid = $scope.parentvm.formid;
    vm.parentform = $scope.form;

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

    vm.moveFieldUp = moveFieldUp;
    vm.moveFieldDown = moveFieldDown;
    vm.addNewField = addNewField;
    vm.deleteField = deleteField;
    vm.addOption = addOption;
    vm.toggleOptionsView = toggleOptionsView;
    vm.loadBulkOptions = loadBulkOptions;
    vm.storeBulkOptions = storeBulkOptions;
    vm.deleteOption = deleteOption;
    vm.isFieldWithOptions = isFieldWithOptions;
    vm.isNew = isNew;
    vm.haveDefault = haveDefault;
    vm.disableRequiredButton = disableRequiredButton;
    vm.disableMultipleButton = disableMultipleButton;
    vm.add_fields_enabled = true;

    activate();

    function activate() {
      if (!vm.parentform.fields) {
        vm.add_fields_enabled = false;
      }
    }

    function getNewFieldID(fieldlist) {
      var ret_field_id = -1;
      for (var i in fieldlist) {
        if(ret_field_id < fieldlist[i].id) {
          ret_field_id = fieldlist[i].id;
        }
      }
      return ret_field_id + 1;
    }

    function moveFieldUp(fieldarray, index) {
      if (index > 0) {
        var temp = fieldarray[index];
        fieldarray[index] = fieldarray[index - 1];
        fieldarray[index - 1] = temp;
      }
    }
    function moveFieldDown(fieldarray, index) {
      if (index < fieldarray.length - 1) {
        var temp = fieldarray[index];
        fieldarray[index] = fieldarray[index + 1];
        fieldarray[index + 1] = temp;
      }
    }

    function addNewField() {
      vm.newField.lastAddedID = getNewFieldID(vm.parentform.fields);

      var newField = {
        "id" : vm.newField.lastAddedID,
        "title" : vm.newField.selected + vm.newField.lastAddedID,
        "type" : vm.newField.selected,
        "value" : "",
        "required" : false,
        "disabled" : false,
        "multiple" : false,
        "persistent": false,
      };

      if(vm.newField.selected === 'nestedfield') {
        // Nested Form details
        var newform = {};
        newform.name = 'Nested Form';
        newform.description = "";
        newform.fields = [];

        newField.value = "";
        newField.fields = newform;
      }

      vm.parentform.fields.push(newField);
    };

    function deleteField(id, array) {
      for(var i in array) {
        if(array[i].id == id) {
          array.splice(i,1);
          break;
        }
      }
    };

    function addOption(field) {
      if(!field.options) {
        field.options = [];
      }
      var lastOptionID = 0;

      if(field.options[field.options.length - 1]) {
        lastOptionID = field.options[field.options.length - 1].id;
      }
      var option_id = lastOptionID + 1;

      var newOption = {
        "id" : option_id,
        "title" : "Option" + option_id,
        "value" : option_id
      };

      field.options.push(newOption);
    };

    function toggleOptionsView(field_index, field) {
      if(!field.isBulk) {
        vm.loadBulkOptions(field_index, field);
      }
      field.isBulk = !field.isBulk;
    };

    function loadBulkOptions(field_index, field) {
      vm.temp_form_fields[field_index] = angular.copy(field);
      vm.temp_form_fields[field_index].raw_list = "";
      for (var i in vm.temp_form_fields[field_index].options) {
        vm.temp_form_fields[field_index].raw_list += vm.temp_form_fields[field_index].options[i].title;
        if(i != (vm.temp_form_fields[field_index].options.length - 1)) {
          vm.temp_form_fields[field_index].raw_list += ", ";
        }
      }
    };

    function storeBulkOptions(field_index, field) {
      field.options = [];
      var splits = vm.temp_form_fields[field_index].raw_list.split(",");
      for (var i in splits) {
        var newOption = {
          'id' : i,
          'title' : splits[i].trim(),
          'value' : splits[i].trim().toLowerCase()
        };
        field.options.push(newOption);
      }
    };

    function deleteOption(field, option) {
      for(var i in field.options) {
        if(field.options[i].id == option.id) {
          field.options.splice(i,1);
          break;
        }
      }
    };

    function isFieldWithOptions(field) {
      if(WITH_OPTIONS_FIELDS.indexOf(field.type) !== -1) {
        return true;
      } else {
        return false;
      }
    };

    function haveDefault(field) {
      if(NO_DEFAULTS_FIELDS.indexOf(field.type) != -1) {
        return false;
      } else {
        return true;
      }
    }

    function disableRequiredButton(field) {
      if (NO_REQUIRED_BUTTON_FIELDS.indexOf(field.type) != -1) {
        return true;
      } else {
        return false;
      }
    }

    function disableMultipleButton(field) {
      if (NO_MULTIPLE_BUTTON_FIELDS.indexOf(field.type) != -1) {
        return true;
      } else {
        return false;
      }
    }

    function isNew() {
      $scope.parentvm.isNew();
    };
  }
})();
