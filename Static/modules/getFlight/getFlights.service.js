(function() {
  'use strict';

  angular
    .module('app.getFlights')
    .factory('getFlights', getFlights);

  getFlights.$inject = ["$http", "$q", "$routeParams"];

  function getFlights($http, $q, $routeParams) {
      console.log('getFliggghts')
    var service = {
       search: search,
       error: 'null',
       flights: {},
       orderNextPage: orderNextPage,
       orderPreviousPage: orderPreviousPage,
       goToPage: goToPage,
       errors: {}
    };

    return service;

    ////////////
    var data = [];
      
    function orderNextPage() {
        var page = parseInt($routeParams.id, 10) + 1;
        page >= 0 ? page = page : page = 0;
        $http.get("/pollSession/" + page).then(setFlights).then(function(){
            location.hash = 'search/' + page;
        }).catch(function(err) {
            console.log(err);
            service.errors[err.data] = err.data;
        })
    }
      
    function orderPreviousPage() {
        var page = parseInt($routeParams.id, 10) - 1;
        $http.get("/pollSession/" + page).then(setFlights).then(function(){
            location.hash = 'search/' + page;
        }).catch(function(err) {
            console.log(err);
            service.errors[err.data] = err.data;
        })
    }
      
    function goToPage(page) {
        page >= 0 ? page = page : page = 0;
        $http.get("/pollSession/" + page).then(setFlights).then(function(){
            location.hash = 'search/' + page;
        }).catch(function(err) {
            console.log(err);
            service.errors[err.data] = err.data;
        })
    }
      
    function search(formData) {
        data = formData;  
        service.error = null;
        service.errors = {};
        $('#originplaceshadow').trigger('input');
        $('#destinationplaceshadow').trigger('input');
//           data.originplace = vm.suggestions.suggestions.find(function(element) {
//               return element.PlaceName === $('#originplace').val();
//           }).PlaceId;
        return $http.post("/search",formData).then(setFlights).catch(function(err){
            //service.errors[err.data] = err.data;
            err.data.ValidationErrors.forEach(function(error){
                if(service.errors[error.Message]) {
                    service.errors[error.Message + "1"] = error.Message + ',' + error.ParameterName;
                } else {
                    service.errors[error.Message] = error.Message + ',' + (error.ParameterName || '.');
                }
            });
        });

    }
      
    function setFlights(result) {
        console.log(result)
        if(result.data.Status === "UpdatesComplete" && result.data.Itineraries.length === 0) {
            service.error = 'please changes the dates!!';
            console.log('no resluts provided')
            return;
        }
        if(result.data.Status === "UpdatesPending") {
            service.error = 'please wait';
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
        });

        var carriers = {};
        result.data.Carriers.forEach(function(carrier){
            carriers[carrier.Id] = carrier.ImageUrl
        })
        var id = parseInt($routeParams.id, 10);

        service.flights = service.flights || [];
        service.flights[id] =  result.data.Itineraries || service.flights[id];
        service.flights[id] = service.flights[id].map(function(flight){
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
            var pricingOptions = {};
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
        if (id === 0 ) {
            console.log('newTicket');
            $http.get('/newTicket');    
        }
        
        service.flights.currentPage = service.flights[id];
        console.log(service.flights)
    }
      
  }
      
})();