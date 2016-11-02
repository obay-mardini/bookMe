(function() {
    'use strict'

    angular
        .module('app.search')
        .controller('SearchController', SearchController);
    
    SearchController.$inject = ["$http", "$q","$routeParams", "autoComplete", "getFlights", "GeoLocationController", "spinner"]
    function SearchController($http, $q, $routeParams, autoComplete, getFlights, GeoLocationController, spinner) {
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
        vm.spiner = spiner;
        vm.showMeError = showMeError;
        vm.showInfoBox = showInfoBox;
        // turn on the spinner
        spinner.start();
        
        //show info box when click stops
        function showInfoBox(id, event) {
            console.log($(event.target).parent())
            $(event.target).parent().append('<div class="infoBox">' + vm.flights[id].destinationStops + '</div>')
        }
        
        function spiner() {
            return getFlights.loading;
        }
        
        GeoLocationController.city().then(function(result){
            vm.city =  result;
        });
        
        function showMeError() {
             
            if(JSON.stringify(getFlights.errors) === "{}") {
                return false;
            } else {
                return getFlights.errors;
            }
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
                vm.ways = 'return';
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
            return getFlights.search(vm.data);
        }
        
        function deepUrl(url) {    
            var url = $(url.currentTarget);
            var id = url.attr('ticketId');
            var parentDiv = url.parent().parent();
            var ticket = vm.flights['currentPage'][id];
            $http.post('/bookTicket', {
                ticket: ticket,
                journeyId: getFlights.journeyId
            });
            console.log(url.attr('href'))
            window.open(url.attr('href'), '_blank');
            //$http.put("/deepLink")
        }
    }
})();