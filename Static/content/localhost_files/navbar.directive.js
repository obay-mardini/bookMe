(function() {
    'use strict'
    
    angular
        .module('app.layout')
        .directive('obNavbar', obNavbar);
    
    function obNavbar() {
        return {
          templateUrl: 'modules/layout/navbar.html',
          restrict: 'E',
          scope: {},
          controller: NavbarController,
          controllerAs: 'vm'
        };
    }
    
    NavbarController.$inject = ['$location', 'authService'];
    
    function NavbarController($location, authService, $http) {
        var vm = this;
        var user = null;
        
        vm.logout = logout;
        vm.isLoggedIn = isLoggedIn;
        authService.userName();
    
        function isLoggedIn () {
            return authService.isLoggedIn();
        }
        
        
        function logout() {
            return authService.logout()     
        }
        
    }
})();