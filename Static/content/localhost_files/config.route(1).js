(function() {
    'use strict'
    
    angular
        .module('app.search')
        .config(configFunction);
    
    configFunction.$inject = ['$routeProvider'];
    
    function configFunction($routeProvider) {
        $routeProvider.when('/search/:id', {
            templateUrl: 'modules/search/search.html',
            controller: 'SearchController',
            controllerAs: 'vm'
        });
    }
})();