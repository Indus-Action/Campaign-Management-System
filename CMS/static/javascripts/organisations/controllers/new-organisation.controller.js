(function () {
  'use strict';

  angular
    .module('vms2.organisations.controllers')
    .controller('NewOrganisationController', NewOrganisationController);

  NewOrganisationController.$inject = ['$location', '$rootScope', '$scope','Organisations'];

  function NewOrganisationController($location, $rootScope, $scope, Organisations) {
    var vm = this;

    vm.submit = submit;

    function submit() {
      Organisations.create(vm.name, vm.phone, vm.location)
        .then(organisationCreateSuccessFn, organisationCreateFailureFn);

      function organisationCreateSuccessFn(data, status, headers, config) {
        $rootScope.$broadcast('organisation.created', {
          organisation: data.data
        });

        console.log('A new organisation was created. Organisation = ', data.data);

        $location.url('/organisations/');
      }

      function organisationCreateFailureFn(data, status, headers, config) {
        console.log('Organisation Creation Failed');

        $rootScope.$broadcast('organisation.created.error', {
          organisation: data.data
        });

        $location.url('/organisations/');
      }
    }
  }
})();
