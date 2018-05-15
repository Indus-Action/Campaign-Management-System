angular
  .module('vms2', [
    'vms2.routes',
    'vms2.config',
    'vms2.layout',
    'vms2.locations',
    'vms2.tasks',
    'vms2.task_types',
    'vms2.task_status',
    'vms2.task_status_categories',
    'vms2.feedback_types',
    'vms2.nav',
    'vms2.auth',
    'vms2.core',
    'vms2.forms',
    'vms2.tasks',
    'vms2.auth',
    'vms2.notes',
    'vms2.messages',
    'vms2.todos',
    'vms2.trainingkits',
    'vms2.stages',
    'vms2.tags',
    'vms2.message_templates',
    'vms2.calls',
    'vms2.event_conditions',
    'vms2.hooks',
    'vms2.ivr_templates',
    'vms2.ivrs',
    'vms2.exotel',
    'vms2.guilds',
    'vms2.notices',
    'vms2.space_types',
    'vms2.interests',
    'ui.bootstrap',
    'ngMaterial',
    'ngMessages',
    'ngStorage',
    'angularFileUpload',
    'dndLists',
    'smart-table'
  ]);

angular
  .module('vms2.routes', ['ngRoute']);

angular
  .module('vms2.config', []);

angular
  .module('vms2')
  .run(run)

function run($http) {
  $http.defaults.xsrfHeaderName = 'X-CSRFToken';
  $http.defaults.xsrfCookieName = 'csrftoken';
}
