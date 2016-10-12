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
                console.log(result)
                var agents = {};
                result.data.Agents.forEach(function(agent){
                    agents[agent.Id.toString()] = agent.Name;
                })
                var legs = {};
                result.data.Legs.forEach(function(leg){
                    legs[leg.Id] = [leg.Arrival, leg.Departure, leg.Directionality, leg.DestinationStation, leg.OriginStation, leg.Carriers];
                });
                var places = {};
                result.data.Places.forEach(function(place){
                    places[place.Id] = place.Name;
                })
                
                var carriers = {};
                result.data.Carriers.forEach(function(carrier){
                    carriers[carrier.Id] = carrier.ImageUrl
                })
                
                vm.flights =  result.data.Itineraries || vm.flights;
                vm.flights = vm.flights.map(function(flight){
                    var outboundId = flight.OutboundLegId;
                    var inboundId = flight.InboundLegId;
                    var arrival = legs[outboundId][0];
                    var departure = legs[outboundId][1];
                    var arrivalR = legs[inboundId][0];
                    var departureR = legs[inboundId][1];
                    var destination = legs[outboundId][3];
                    var origin = legs[outboundId][4];
                    var carrierImage = carriers[legs[outboundId][5]];
                    var carrierImageR = carriers[legs[inboundId][5]];
                    
                    var inboundDuration = Math.abs(new Date(arrival) - new Date(departure))/(1000*60*60);
                    var outboundDuration = Math.abs(new Date(arrivalR) - new Date(departureR))/(1000*60*60);
                    var pricingOptions = {}
                    flight.PricingOptions.map(function(option){
                        
                       pricingOptions = {agent: agents[option.Agents[0]], price: option.Price, DeeplinkUrl: option.DeeplinkUrl}
                    });
                    
                    return {
                            destination: places[destination],
                            origin: places[origin],
                            pricingOptions: pricingOptions,
                            inboundDuration: Math.round(inboundDuration),
                            outboundDuration: Math.round(outboundDuration),
                            carrierImage: carrierImage,
                            carrierImageR: carrierImageR
                           };
                 
                });
                console.log(vm.flights)
            }).catch(function(err){
                console.log(err)
            });
           
        }
    }
})();