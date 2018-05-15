(function () {
  'use strict';

  angular
    .module('vms2.auth.services')
    .factory('Auth', Auth);

  Auth.$inject = ['$http', '$cookies', '$localStorage', '$location'];

  function Auth($http, $cookies, $localStorage, $location) {
    var Auth = {
      login: login,
      logout: logout,
      resetPassword: resetPassword,
      resetPasswordConfirm: resetPasswordConfirm,
      changePassword: changePassword,
      getAuthenticatedUser: get,
      getUserFromLocal: getUserFromLocal,
      update: update,
      updateUserProfile: updateUserProfile,
      register: register,
      deleteUser: deleteUser,
      userUpdateByAdmin: userUpdateByAdmin,
      verifyEmail: verifyEmail,
      all: getUserProfileList,
      allUsers: getUserList,
      get: getUserProfile,
      getUser: getUser,
      getUserListByType: getUserListByType,
      getUserListByTypes: getUserListByTypes,
      getUserTypes: getUserTypes,
      getUserByMobile: getUserByMobile,
      addAltMobileToUser: addAltMobileToUser,
      isAuthenticated: isAuthenticated,
      isAdmin: isAdmin,
      isAuthSkipPath: isAuthSkipPath,
      getAuthSkipPaths: getAuthSkipPaths
    };

    return Auth;

    function getAuthSkipPaths() {
      return [
        '/auth/verifyaccount'
      ];
    }

    function login(username, password) {
      return $http.post('/rest-auth/login/', {
        username: username,
        password: password
      });
    }

    function logout() {
      if($cookies.get('token')) {
        $cookies.remove('token');
      }
      if(typeof $localStorage.user != "undefined") {
        delete $localStorage.user;
      }
      $http.post('/rest-auth/logout/', {})
        .then(logoutSuccessFunction, logoutFailureFunction);

      function logoutSuccessFunction() {
        $location.path('/');
        console.log("Logged out.");
      }
      function logoutFailureFunction() {
        console.log("Logout failed.");
      }
    }

    function resetPassword(email) {
      return $http.post('/rest-auth/password/reset/', {
        email: email
      });
    }

    function resetPasswordConfirm(uid, token, new_password1, new_password2) {
      return $http.post('/rest-auth/password/reset/confirm/', {
        uid: uid,
        token: token,
        new_password1: new_password1,
        new_password2: new_password2
      });
    }

    function changePassword(new_password1, new_password2, old_password) {
      return $http.post('/rest-auth/password/change/', {
        new_password1: new_password1,
        new_password2: new_password2,
        old_password: old_password
      });
    }

    function get(token) {
      return $http.get('/rest-auth/user/' + token + '/');
    }

    function getUserFromLocal() {
      return $localStorage.user;
    }

    function update(token, user_data) {
      var data = {};
      data.id = user_data.id;
      data.first_name = user_data.first_name;
      data.last_name = user_data.last_name;
      data.user_type = user_data.type;
      data.token = token;
      return $http.post('/api/v1/users/', data);
    }

    function updateUserProfile(profile) {
      return $http.put('/api/v1/users/' + profile.id + '/', profile);
    }

    function register(user_data) {
      return $http.post('/rest-auth/registration/', {
        password1: user_data.password1,
        password2: user_data.password2,
        email: user_data.email,
        mobile: user_data.mobile,
        username: user_data.username
      });
    }

    function deleteUser(user_id) {
      return $http.delete('/api/v1/admin/users/' + user_id + '/');
    }

    function userUpdateByAdmin(user_data) {
      var data = {};
      data.first_name = user_data.user.first_name;
      data.last_name = user_data.user.last_name;
      data.mobile = user_data.mobile;
      data.points = user_data.points;
      data.user_type = user_data.user_type;
      return $http.put('/api/v1/admin/users/' + user_data.id + '/', data);
    }

    function verifyEmail(key) {
      return $http.post('/rest-auth/registration/verify-email/', {
        key: key
      });
    }

    function getUserProfileList() {
      return $http.get('/api/v1/users/');
    }

    function getUserList() {
      return $http.get('/api/v1/users_model/');
    }

    function getUserProfile(id) {
      return $http.get('/api/v1/users/' + id + '/');
    }

    function getUser(id) {
      return $http.get('/api/v1/users_model/' + id + '/');
    }

    function getUserListByType(usertype) {
      return $http.get('/api/v1/users/usertype/' + usertype + '/');
    }

    function getUserListByTypes(usertypesarray) {
      var get_string = '?';

      for (var i=0;i<usertypesarray.length;i++) {
        get_string += 'user_types=' + usertypesarray[i];

        if (usertypesarray.length > 1 && i < usertypesarray.length - 1) {
          get_string += '&'
        }
      }

      return $http.get('/api/v1/users/usertypes/' + get_string);
    }

    function getUserTypes() {
      return $http.get('/api/v1/users/usertype/');
    }

    function getUserByMobile(mobile) {
      return $http.get('/api/v1/users/search/?typed=' + mobile);
    }

    function addAltMobileToUser(id, alt_mobile) {
      return $http.put('/api/v1/user/altmobile/' + id + '/', {
        alt_mobile: alt_mobile
      });
    }

    function isAdmin() {
      if($localStorage.user) {
        return $localStorage.user.type == 'AD';
      }
      else {
        return false;
      }
    }

    function isAuthenticated() {
      return $cookies.get('token') == null ? false : true;
    };

    function isAuthSkipPath(path) {
      var flag = false;
      var auth_skip_paths = getAuthSkipPaths();
      for (var p in auth_skip_paths) {
        if(path.indexOf(auth_skip_paths[p]) !== -1) {
          flag = true;
          break;
        }
      }
      return flag;
    };
  }
})();
