(function() {
    'use strict'

    angular
        .module('app.auth')
        .controller('AuthController', AuthController);

    AuthController.$inject = ['authService'];
    
    function AuthController(authService) {
        var vm = this;
        
        vm.error = authService.checkError;
        vm.register = authService.register;
        vm.login = authService.login;
        vm.user = {
            email: '',
            passwod: '',
            user: ''
        };  
        
        
    }
})();