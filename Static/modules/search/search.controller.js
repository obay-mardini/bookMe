(function() {
    'use strict'

    angular
        .module('app.search')
        .controller('SearchController', SearchController);
    
    SearchController.$inject = ["$http"]
    function SearchController($http) {
        var vm = this;
        vm.flights;
        $http.defaults.headers.common = {
                'Access-Control-Allow-Origin': '*'
        };
        
        
        vm.search = search;
        search();
        
        function search(data) {
            $http.post("/search").then(function(result){
                vm.flights =  result.data.Itineraries || vm.flights;
                console.log(vm.flights)
                vm.flights.forEach(function(flight){
                                   console.log(flight.PricingOptions[0].Price);
                                   });
            }).catch(function(err){
                console.log(err)
            });
        }
    }
})();