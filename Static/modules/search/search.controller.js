(function() {
    'use strict'

    angular
        .module('app.search')
        .controller('SearchController', SearchController);
    
    SearchController.$inject = ["$http", "$q","$routeParams", "autoComplete", "getFlights", "GeoLocationController"]
    function SearchController($http, $q, $routeParams, autoComplete, getFlights, GeoLocationController) {
        console.log('searchCOntrollllllller')
        var vm = this;
        vm.flights = getFlights.flights;
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
        vm.showSuggestion = showSuggestion;
        vm.error = null;
        vm.today = new Date();
        vm.toggleWays = toggleWays;
        vm.twoWays = true;
        vm.ways = 'two ways'
        vm.orderNextPage = getFlights.orderNextPage;
        vm.orderPreviousPage = getFlights.orderPreviousPage;
        vm.goToPage = getFlights.goToPage;
        vm.currentPage = $routeParams.id;
        vm.cancelSuggestions = cancelSuggestions;
        vm.giveMe = function() {
            console.log(vm.currentPage)
        }
        vm.spiner = function() {
            console.log(getFlights.loading)
            return getFlights.loading;
        }
        
        GeoLocationController.city().then(function(result){
            vm.city =  result;
        });
        vm.showMeError = function() {
            return getFlights.errors;
        }
        
        function cancelSuggestions(element) {
            cancelSuggestions = autoComplete.cancelSuggestions(element);
            if(cancelSuggestions) {
                vm.error = cancelSuggestions;
            }
        }
        
        function toggleWays() {
            vm.twoWays = !vm.twoWays;
            if(vm.twoWays) {
                vm.ways = 'one way';
            } else {
                vm.ways = 'two ways';
            }
        }
        
        function showSuggestion() {
            return autoComplete.noS();
        }
        
        function selectTicket() {
            if(parseInt($routeParams.id, 10) !== 0) {
                location.hash = '/search/0'
            }
            vm.error = null
            vm.data.city = vm.city;
            console.log(vm.city)
            return getFlights.search(vm.data);
        }
        
        function deepUrl(url) {    
            var url = $(url.currentTarget);
            var parentDiv = url.parent().parent();
//            $http.post('/deepUrl', {
//                
//            });
            console.log(parentDiv.getElementsByClassName('price')[0].innerHTML)
            $http.post('/bookTicket', {
                price: parentDiv.getElementsByClassName('price')[0].innerHTML,
                
            })
            window.open(url.attr('href'), '_blank');
            //$http.put("/deepLink")
        }
    }
})();