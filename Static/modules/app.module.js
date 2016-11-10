(function() {
  'use strict';
    
  angular
    .module('app', [
      'ngRoute',
      'app.layout',
      'app.auth',
      'app.search',
      'app.autoComplete',
      'app.getFlights',
      'app.geoLocation',
      'app.spinner'
  ])
    .config(configFunction);
  
  configFunction.$inject = ['$routeProvider'];
    
    function configFunction($routeProvider) {
        $routeProvider.otherwise({
            redirectTo: '/search/0',
        });
    }

})();
