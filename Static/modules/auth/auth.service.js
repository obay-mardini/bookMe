(function() {
  'use strict';

  angular
    .module('app.auth')
    .factory('authService', authService);

  authService.$inject = ['$http', '$q', 'GeoLocationController'];

  function authService($http, $q, GeoLocationController) {
      
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
      
    function checkDB(country, user) {
        var deferred = $q.defer();
           var newUser = {
                user: user.user,
                email: user.email,
                password: user.password,
                country: country.country
            };
           $http.post('/register', newUser).success(function(result,status) {
        if(status === 200 && result){
            login(user);
            deferred.resolve();
        } else {
            deferred.reject();
        }
        }).error(function(error) {
            service.error = error;
            deferred.reject();
        });
        
        return deferred.promise;
    }
      
    function register(user) {
       return new Promise(function(resolve, reject){
           var country = GeoLocationController.city()
           resolve(country);
       }).then(function(country) {
          return checkDB(country, user);
       })           
    }

    function logout(user) {
        var deferred = $q.defer();
        service.error = '';
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
                service.user = result.user;
                location.hash = '';
                deferred.resolve();
            } else {
                service.user = false;
                deferred.reject()
            }
        }).error(function(error) {
            service.user = false;
            service.error = error;
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