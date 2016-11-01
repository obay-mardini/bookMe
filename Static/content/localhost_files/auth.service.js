(function() {
  'use strict';

  angular
    .module('app.auth')
    .factory('authService', authService);

  authService.$inject = ['$http', '$q'];

  function authService($http, $q) {
      
    var service = {
      userName: userName, 
      isLoggedIn: isLoggedIn,
      user : null,
      register: register,
      login: login,
      logout: logout,
      checkError: checkError,
      error: ''
    };

    return service;

    ////////////
      
    
    function userName() {
        return $http.get('/isLoggedIn').then(function(result) {
            service.user = result.data.name;
            return result.data;
        });
    }
      
    function checkError() {
        return service.error;
    }
      
    function register(user) {
        var deferred = $q.defer();
        
        $http.post('/register', {
            user: user.user,
            email: user.email,
            password: user.password
        }).success(function(result,status) {
            if(status === 200 && result){
                login(user);
                deferred.resolve();
            } else {
                deferred.reject();
            }
        }).error(function(error) {
            service.error = error.data;
            deferred.reject();
        });
        
         return deferred.promise;
    }

    function logout(user) {
        var deferred = $q.defer();
        
        $http.get('/logout').success(function(result, status) {
            service.user = false;
            location.hash = 'register';
            deferred.resolve();
        }).error(function(error) {
            service.error = error;
            deferred.reject();
        });
        
        return deferred.promise();
    }

    function login(user) {  
        var deferred = $q.defer();
        
        $http.post('/login', {
            user: user.user,
            email: user.email,
            password: user.password
        }).success(function(result,status) {
            if(status === 200 && result) {
                service.loggedin = true;
                service.user = result[0].name;
                location.hash = '';
                deferred.resolve();
            } else {
                service.user = false;
                deferred.reject()
            }
        }).error(function(error) {
            service.user = false;
            service.error = error.data;
            deferred.reject();
        });
        
        return deferred.promise;
    }
    
      function isLoggedIn () {
            if(service.user){
                return true;
            } else {
                return false;
            }
        }
  }

})();