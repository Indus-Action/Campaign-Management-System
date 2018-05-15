(function () {
  'use strict';

  angular
    .module('vms2.forms.directives')
    .directive('formDirective', formDirective);

  function formDirective() {

    var formDirective = {
      controller: function ($scope) {
        $scope.submit = function (is_not_final_submit) {
          if ($scope.live == true) {
            $scope.vm.submitForm($scope.form);
          } else {
            alert('Form submitted..');
          }

          if (!is_not_final_submit) {
            $scope.form.submitted = true;
          }
        };

        $scope.$on('submitrequest', function () {
          $scope.submit(true);
        });

        $scope.cancel = function() {
          alert('Form canceled..');
          $scope.vm.resetForm();
        };

        $scope.is_fab_open = false;
      },
      templateUrl: '/static/templates/forms/form.html',
      restrict: 'E',
      scope: {
        form: '=',
        vm: '=',
        live: '=',
        persistent: '='
      }
    };

    return formDirective;
  }
})();
