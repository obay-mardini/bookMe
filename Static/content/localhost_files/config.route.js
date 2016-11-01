(function() {
    'use strict'
    
    angular
        .module('app.auth')
        .config(configFunction);
    
    configFunction.$inject = ['$routeProvider'];
    
    function configFunction($routeProvider) {
        $routeProvider.when('/register', {
            templateUrl: 'modules/auth/register.html',
            controller: 'AuthController',
            controllerAs: 'vm'
        });
         $routeProvider.when('/login', {
            templateUrl: 'modules/auth/login.html',
            controller: 'AuthController',
            controllerAs: 'vm'
        });
    }
})();