(function () {
  'use strict';

  angular
    .module('vms2.forms.services')
    .factory('Forms', Forms);

  function Forms($http) {
    var Forms = {
      fields: fields,
      get: get,
      getOne: getOne,
      getPersistentForm: getPersistentForm,
      getPersistentData: getPersistentData,
      create: create,
      save: save,
      savePersistentForm: savePersistentForm,
      deleteForm: deleteForm,
      submitFormData: submitFormData,
      getFormDataList: getFormDataList,
      deleteFormData: deleteFormData,
      updateFormData: updateFormData,
      getFormData: getFormData
    };

    return Forms;

    function fields() {
      return [
        {
          name : 'textfield',
          value : 'Textfield'
        },
        {
          name : 'email',
          value : 'E-mail'
        },
        {
          name : 'password',
          value : 'Password'
        },
        {
          name : 'radio',
          value : 'Radio Buttons'
        },
        {
          name : 'dropdown',
          value : 'Dropdown List'
        },
        {
          name : 'date',
          value : 'Date'
        },
        {
          name : 'textarea',
          value : 'Text Area'
        },
        {
          name : 'checkbox',
          value : 'Checkbox'
        },
        {
          name : 'hidden',
          value : 'Hidden'
        },
        {
          name : 'location',
          value : 'Location'
        },
        {
          name : 'autocomplete',
          value : 'AutoComplete'
        },
        {
          name : 'user',
          value : 'User'
        },
        {
          name : 'nestedfield',
          value : 'Nested Field'
        },
        {
          name : 'submitbutton',
          value : 'Submit Button'
        }
      ];
    }

    function get() {
      return $http.get('/api/v1/forms/');
    }

    function getOne(id) {
      return $http.get('/api/v1/forms/' + id + '/');
    }

    function getPersistentForm() {
      return $http.get('/api/v1/persistent_forms/')
    }

    function create(data) {
      return $http.post('/api/v1/forms/', {
        name: data.name,
        description: data.description,
        schema: data.fields
      });
    }

    function save(data) {
      return $http.put('/api/v1/forms/' + data.id + '/', {
        name: data.name,
        description: data.description,
        schema: data.fields
      });
    }

    function savePersistentForm(data) {
      return $http.put('/api/v1/persistent_forms/' + data.id + '/', {
        name: data.name,
        description: data.description,
        schema: data.fields
      });
    }

    function getPersistentData(beneficiary) {
      return $http.get('/api/v1/persistent_form_data/' + beneficiary + '/');
    }

    function deleteForm(id) {
      return $http.delete('/api/v1/forms/' + id + '/');
    }

    function submitFormData(form_id,beneficiary_form, data) {
      return $http.post('/api/v1/forms-data/', {
        data: data,
        beneficiary_form:beneficiary_form,
        form: form_id
      });
    }

    function getFormDataList(form_id) {
      return $http.get('/api/v1/form-data/' + form_id + '/');
    }

    function getFormData(data_id) {
      return $http.get('/api/v1/forms-data/' + data_id + '/');
    }

    function deleteFormData(data_id) {
      return $http.delete('/api/v1/forms-data/' + data_id + '/');
    }

    function updateFormData(data_id, form_id,beneficiary_form, data) {
      return $http.put('/api/v1/forms-data/' + data_id + '/', {
        data: data,
        form: form_id,
        beneficiary_form:beneficiary_form
      });
    }
  }
})();
