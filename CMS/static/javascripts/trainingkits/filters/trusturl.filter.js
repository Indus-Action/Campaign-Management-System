(function () {
  'use strict';

  angular
    .module('vms2.trainingkits.controllers')
    .filter('TrustUrl', TrustUrl);

  TrustUrl.inject = ['$sce'];

  function TrustUrl($sce) {
    return function (url) {
      return $sce.trustAsResourceUrl(url);
    };
  }
})();
