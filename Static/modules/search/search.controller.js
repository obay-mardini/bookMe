(function() {
    'use strict'

    angular
        .module('app.search')
        .controller('SearchController', SearchController);
    
    SearchController.$inject = ["$http", "$q","$routeParams", "autoComplete", "getFlights"]
    function SearchController($http, $q, $routeParams, autoComplete, getFlights) {
        console.log('searchCOntrollllllller')
        var vm = this;
        vm.flights = getFlights.getFlights;
        vm.deepUrl = deepUrl;
        vm.search = getFlights.search;
        vm.selectTicket = selectTicket;
        vm.data = null;
        vm.suggestions = autoComplete.suggestions;
        vm.predict = autoComplete.predict;
        vm.active = autoComplete.active;
        vm.inActive = autoComplete.inActive;
        vm.chooseSuggestion = autoComplete.chooseSuggestion;
        vm.input = autoComplete.input;
        vm.currentInputElement = autoComplete.currentInputElement;
        vm.cancelSuggestions = autoComplete.cancelSuggestions;
        vm.showSuggestion = showSuggestion;
        vm.error = null;
        vm.today = new Date();
        vm.toggleWays = toggleWays;
        vm.twoWays = true;
        vm.ways = 'two ways'
        vm.orderNextPage = orderNextPage;
        vm.giveMe = function() {
            console.log(vm.flights.currentPage)
        }
        
        function toggleWays() {
            console.log('toggle')
            vm.twoWays = !vm.twoWays;
            if(vm.twoWays) {
                vm.ways = 'two ways';
            } else {
                vm.ways = 'one way';
            }
        }
        function showSuggestion() {
            return autoComplete.noS();
        }
        
        function selectTicket() {
            console.log('calling seach')
            getFlights.search(vm.data);
        }
        
        function deepUrl(url) {
            window.open($(url.currentTarget).attr('href'), '_blank');
            //$http.put("/deepLink")
        }
        
        function orderNextPage(page) {
            console.log(page)
            $http.get("/pollSession/" + page).then(setFlights).then(function(){
                location.hash = 'search/' + page;
            }).catch(function(err) {
                console.log(err);
            })
        }
        
        

        
    }
})();