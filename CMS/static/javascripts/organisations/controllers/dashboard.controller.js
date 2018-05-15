(function () {
  'use strict';

  angular
    .module('vms2.organisations.controllers')
    .controller('OrganisationsDashboardController', OrganisationsDashboardController);

  OrganisationsDashboardController

  function OrganisationsDashboardController($scope, Organisations) {
    var vm = this;

    vm.organisations = [];

    activate();

    Organisations.all()
      .then(organisationsAllSuccessFn, organisationsAllFailureFn);

    $scope.$on('organisation.created', function(event, organisation) {
      vm.organisations.unshift(organisation);
    });

    $scope.$on('organisation.created.error', function () {
      vm.organisations.shift();
    });

    function organisationsAllSuccessFn(data, status, headers, config) {
      vm.organisations = data.data;
    }

    function organisationsAllErrorFn(data, status, headers, config) {
      console.log('Error while getting all organisations in org dashboard controller');
    }
  }
})();
