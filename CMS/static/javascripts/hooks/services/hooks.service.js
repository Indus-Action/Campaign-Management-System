(function () {
  'use strict';

  angular
    .module('vms2.hooks.services')
    .factory('Hooks', Hooks);

  Hooks.$inject = ['$http', '$localStorage'];

  function Hooks($http, $localStorage) {
    var Hooks = {
      actions: actions,
      allActions: allActions,
      all: all,
      create: create,
      get: get,
      remove: remove,
      update: update,
      getActionFromLocalStorage: getActionFromLocalStorage
    };

    return Hooks;

    function allActions() {
      return $http.get('/api/v1/actions/');
    }

    function actions() {
      return $http.get('/api/v1/get_action_classes/');
    }

    function all() {
      return $http.get('/api/v1/hooks/');
    }

    function create(data) {
      return $http.post('/api/v1/hooks/', {
        hook_type: data.name
      });
    }

    function get(id) {
      return $http.get('/api/v1/hooks/' + id + '/');
    }

    function remove(id) {
      return $http.delete('/api/v1/hooks/' + id + '/');
    }

    function update(hook) {
      return $http.put('/api/v1/hooks/' + hook.id + '/', hook);
    }

    function getActionFromLocalStorage(id) {
      var system_actions = $localStorage.all_system_actions,
          system_hooks = $localStorage.system_hooks,
          action = null,
          hook = null;

      // TODO: Improve this with promise
      if (system_hooks && system_actions) {
        for (var t in system_hooks) {
          if (system_hooks[t].id === id) {
            hook = system_hooks[t];
            for (var a in system_actions) {
              if (hook.action === system_actions[a].id) {
                action = system_actions[a];
                break;
              }
            }
            break;
          }
        }
      }

      return action;
    }
  }
})();
