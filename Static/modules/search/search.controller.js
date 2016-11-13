(function() {
    'use strict'

    angular
        .module('app.search')
        .controller('SearchController', SearchController);

    SearchController.$inject = ["$http", "$q", "$routeParams", "autoComplete", "getFlights", "GeoLocationController", "spinner", "$scope"]

    function SearchController($http, $q, $routeParams, autoComplete, getFlights, GeoLocationController, spinner, $scope) {
        var vm = this;
        vm.flights = getFlights.flights;
        vm.deepUrl = deepUrl;
        vm.selectTicket = selectTicket;
        vm.data = null;
        vm.suggestions = autoComplete.suggestions;
        vm.predict = autoComplete.predict;
        vm.active = autoComplete.active;
        vm.inActive = autoComplete.inActive;
        vm.chooseSuggestion = autoComplete.chooseSuggestion;
        vm.input = autoComplete.input;
        vm.currentInputElement = currentInputElement;
        vm.showSuggestion = showSuggestion;
        vm.error = null;
        vm.today = new Date();
        vm.toggleWays = toggleWays;
        vm.toggleFilter = toggleFilter;
        vm.twoWays = true;
        vm.ways = 'One Way';
        vm.orderNextPage = getFlights.orderNextPage;
        vm.orderPreviousPage = getFlights.orderPreviousPage;
        vm.goToPage = getFlights.goToPage;
        vm.currentPage = parseInt($routeParams.id, 10);
        vm.cancelSuggestions = cancelSuggestions;
        vm.spiner = spiner;
        vm.showMeError = showMeError;
        vm.showInfoBox = showInfoBox;
        vm.origin = false;
        vm.destionation = false;
        vm.filter = false;

        // turn on the spinner
        spinner.start();
        autoComplete.call();

        vm.toolTip = function(event, stops) {
            if (stops.length === 0) {
                stops.push('No Stops');
            }
            console.log(stops.join(', '))
            $(event.currentTarget).next().addClass('tooltip')
            $(event.currentTarget).next().attr('margin-left', '100px')
            $(event.currentTarget).next().text(stops.join(' '));
        }
        vm.hideToolTip = function(event, stops) {
            $(event.currentTarget).next().addClass('hidden')
            $(event.currentTarget).next().removeClass('tooltip')
        }

        function currentInputElement(element) {
            if (element === '#destinationplace') {
                vm.origin = false;
                vm.destionation = true;

            } else {
                vm.destionation = false;
                vm.origin = true;
            }
            setTimeout(function() {
                autoComplete.currentInputElement(element)
            }, 10);
        }
        //show info box when click stops
        function showInfoBox(id, event) {
            $(event.target).parent().append('<div class="infoBox">' + vm.flights[id].destinationStops + '</div>')
        }

        function spiner() {
            return getFlights.loading;
        }

        GeoLocationController.city().then(function(result) {
            vm.city = result.city;
            vm.country = result.country;
        });

        function showMeError() {

            if (JSON.stringify(getFlights.errors) === "{}") {
                return false;
            } else {
                return getFlights.errors;
            }
        }

        function cancelSuggestions(element) {
            cancelSuggestions = autoComplete.cancelSuggestions(element);
            if (cancelSuggestions) {
                vm.error = cancelSuggestions;
            }
        }

        function toggleWays() {
            vm.twoWays = !vm.twoWays;
            if (vm.twoWays) {
                vm.ways = 'One Way';
               
            } else {
                vm.ways = 'Return';
                 vm.data.inbounddate = undefined;
            }
        }

        function toggleFilter() {
            vm.filter = !vm.filter;
            if (vm.filter) {
                vm.data.filter = true;
            } else {
                vm.data.filter = false;
            }
        }

        function showSuggestion() {
            return autoComplete.noS();
        }

        function selectTicket() {
            if (parseInt($routeParams.id, 10) !== 0) {
                location.hash = '/search/0'
            }

            vm.error = null
            vm.data.city = vm.city;
            vm.data.country = vm.country;
            return new Promise(function(resolve, reject) {
                    resolve(getFlights.search(vm.data));
                })
                //                .then(function() {
                //                console.log('update the scope')
                //                //update the scoop 
                //                vm.flights = getFlights.flights;
                //                setTimeout($scope.$apply, 17)
                //                //$scope.$apply();
                //            })
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
            window.open(url.attr('href'), '_blank');
            //$http.put("/deepLink")
        }
    }
})();