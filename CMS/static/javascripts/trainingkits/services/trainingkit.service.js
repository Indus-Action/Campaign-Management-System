(function () {
  'use strict';

  angular
    .module('vms2.trainingkits.services')
    .factory('TrainingKit', TrainingKit);

  TrainingKit.$inject = ['$cookies', '$http', 'FileUploader'];

  function TrainingKit($cookies, $http, FileUploader) {
    var TrainingKit = {
      getAll: getAll,
      get: get,
      getPageTypes: getPageTypes,
      getKitPages: getKitPages,
      create: create,
      save: save,
      deleteKit: deleteKit,
      createPage: createPage,
      getPage: getPage,
      getAllPages: getAllPages,
      deletePage: deletePage,
      updatePage: updatePage,
      pageFilesUploader: pageFilesUploader,
      pageFileDelete: pageFileDelete
    };
    return TrainingKit;

    function getAll() {
      return $http.get('/api/v1/trainingkits/');
    }

    function get(kit_id) {
      return $http.get('/api/v1/trainingkits/' + kit_id + '/');
    }

    function getPageTypes() {
      return $http.get('/api/v1/trainingkits/pagetypes/');
    }

    function getKitPages(kit_id) {
      return $http.get('/api/v1/trainingkitpages/' + kit_id + '/');
    }

    function create(data) {
      return $http.post('/api/v1/trainingkits/', {
        name: data.name,
        description: data.description
      });
    }

    function save(data) {
      return $http.put('/api/v1/trainingkits/' + data.id + '/', {
        name: data.name,
        description: data.description
      });
    }

    function deleteKit(kit_id) {
      return $http.delete('/api/v1/trainingkits/' + kit_id + '/');
    }

    function createPage(kit_id, page_data) {
      return $http.post('/api/v1/pages/', {
        name: page_data.name,
        description: page_data.description,
        content: page_data.content,
        content_type: page_data.content_type,
        kit: kit_id
      });
    }

    function getPage(page_id) {
      return $http.get('/api/v1/pages/' + page_id + '/');
    }

    function getAllPages() {
      return $http.get('/api/v1/pages/');
    }

    function deletePage(page_id) {
      return $http.delete('/api/v1/pages/' + page_id + '/');
    }

    function updatePage(page_id, kit_id, page_data) {
      return $http.put('/api/v1/pages/' + page_id + '/', {
        name: page_data.name,
        description: page_data.description,
        content: page_data.content,
        content_type: page_data.content_type,
        kit: kit_id
      });
    }

    function pageFilesUploader(page_id) {
      return new FileUploader({
        url : '/api/v1/pages/fileupload/',
        headers : {
          'X-CSRFToken' : $cookies.get('csrftoken'),
          'TOKEN' : $cookies.get('token'),
          'PAGEID' : page_id
        }
      });
    }

    function pageFileDelete(filename) {
      return $http.delete('/api/v1/pages/fileupload/' + '?file=' + filename);
    }
  }
})();
