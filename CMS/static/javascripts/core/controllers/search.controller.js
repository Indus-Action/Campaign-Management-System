(function () {
  'use strict';

  angular
    .module('vms2.core.controllers')
    .controller('SearchController', SearchController);

  SearchController.$inject = ['$location', '$mdDialog', 'Auth'];

  function SearchController($location, $mdDialog, Auth) {
    var vm = this;

    vm.mobile = '';
    vm.searchMobile = searchMobile;
    vm.loading = false;
    vm.search_no_results = false;

    function searchMobile() {
      vm.search_no_results = false;
      vm.loading = true;

      Auth.getUserByMobile(vm.mobile)
        .then(searchSuccessFn, searchFailureFn);
    }

    function searchSuccessFn(response) {
      vm.loading = false;

      if (response.data && response.data.length > 0) {
        $location.url('/users/' +  response.data[0].user.id);
        $mdDialog.hide(response);
      } else {
        vm.search_no_results = true;
      }
    }

    function searchFailureFn(response) {
      vm.loading = false;
      vm.search_no_results = true;
    }
  }
})();
