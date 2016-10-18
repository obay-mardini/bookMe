(function() {
    'use strict'

    angular
        .module('app.search')
        .controller('SearchController', SearchController);
    
    SearchController.$inject = ["$http", "$q", "autoComplete"]
    function SearchController($http, $q, autoComplete) {
        var vm = this;
        vm.flights;
        vm.deepUrl = deepUrl;
        vm.search = search;
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
        function showSuggestion() {
            return autoComplete.noS();
        }
        
        function selectTicket() {
            search(vm.data);
        }
        
        function deepUrl(url) {
            console.log(url)
            window.open($(url).href, '_blank');
            //$http.put("/deepLink")
        }
        
        
        function search(data) {
            vm.error = null;
            $('#originplaceshadow').trigger('input');
            $('#destinationplaceshadow').trigger('input');
//           data.originplace = vm.suggestions.suggestions.find(function(element) {
//               return element.PlaceName === $('#originplace').val();
//           }).PlaceId;
            $http.post("/search",data).then(function(result){
                console.log(result)
                if(result.data.Status === "UpdatesComplete" && result.data.Itineraries.length === 0) {
                    vm.error = 'please changes the dates!!';
                    console.log('no resluts provided')
                    return;
                }
                if(result.data.Status === "UpdatesPending") {
                    vm.error = 'please wait';
                    console.log('poll again')
                    return search(data);
                }
                var agents = {};
                result.data.Agents.forEach(function(agent){
                    agents[agent.Id.toString()] = agent.Name;
                })
                var legs = {};
                result.data.Legs.forEach(function(leg){
                    legs[leg.Id] = [leg.Arrival, leg.Departure, leg.Directionality, leg.DestinationStation, leg.OriginStation, leg.Carriers, leg.Stops];
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
                    var arrivalR = inboundId && legs[inboundId][0];
                    var departureR = legs[inboundId][1];
                    var destination = legs[outboundId][3];
                    var origin = legs[outboundId][4];
                    var carrierImage = carriers[legs[outboundId][5]];
                    var carrierImageR = carriers[legs[inboundId][5]];
                    var originStops =  legs[inboundId][6];
                    var destinationStops = legs[outboundId][6];
                    var inboundDuration = Math.abs(new Date(arrival) - new Date(departure))/(1000*60*60);
                    var outboundDuration = Math.abs(new Date(arrivalR) - new Date(departureR))/(1000*60*60);
                    var pricingOptions = {}
                    flight.PricingOptions.map(function(option){
                       pricingOptions = {agent: agents[option.Agents[0]], price: option.Price, DeeplinkUrl: option.DeeplinkUrl}
                    });
                    
                    console.log(originStops.reduce(function(originStops, start){
                                originStops.push(places[start])
                                return originStops
                            }, []))
                    return {
                            destination: places[destination],
                            origin: places[origin],
                            pricingOptions: pricingOptions,
                            inboundDuration: Math.round(inboundDuration),
                            outboundDuration: Math.round(outboundDuration),
                            carrierImage: carrierImage,
                            carrierImageR: carrierImageR,
                            originStops: originStops.reduce(function(originStops, start){
                                originStops.push(places[start])
                                return originStops;
                            }, []),
                            destinationStops: destinationStops.reduce(function(destinationStops, start){
                                destinationStops.push(places[start]);
                                return destinationStops;
                            }, [])
                           };
                 
                });
            }).catch(function(err){
                vm.error = err.statusText;
                console.log(err)
            });
           
        }
    }
})();