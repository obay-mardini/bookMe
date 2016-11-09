(function() {
  'use strict';

  angular
    .module('app.getFlights')
    .factory('getFlights', getFlights);

  getFlights.$inject = ["$http", "$q", "$routeParams"];

  function getFlights($http, $q, $routeParams) {
    var service = {
       search: search,
       error: 'null',
       flights: {},
       orderNextPage: orderNextPage,
       orderPreviousPage: orderPreviousPage,
       goToPage: goToPage,
       errors: {},
       journeyId: null,
       loading : false
    };

    return service;

    ////////////
    var data = [];
      
    function orderNextPage() {
        var page = parseInt($routeParams.id, 10) + 1;
        service.loading = true;
        page >= 0 ? page = page : page = 0;
        $http.get("/pollSession/" + page).then(setFlights).then(function(){
            location.hash = 'search/' + page;
        }).catch(function(err) {
            console.log(err);
            service.errors[err.data] = err.data;
            service.loading = false;
        })
    }
    
    function showController() {
        $('.controller').show();
        $("html, body").animate({ scrollTop: 300 }, 900);
    }
    
    function orderPreviousPage() {
        var page = parseInt($routeParams.id, 10) - 1;
        service.loading = true;
        $http.get("/pollSession/" + page).then(setFlights).then(function(){
            location.hash = 'search/' + page;
        }).catch(function(err) {
            console.log(err);
            service.errors[err.data] = err.data;
            service.loading = false;
        })
    }
      
    function goToPage(page) {
        var start = new Date;
        page >= 0 ? page = page : page = 0;
        service.loading = true;
        $http.get("/pollSession/" + page).then(setFlights).then(function(){
            console.log(new Date - start)
            location.hash = 'search/' + page;
        }).catch(function(err) {
            console.log(err);
            service.errors[err.data] = err.data;
            service.loading = false;
        })
    }
      
    function search(formData) {
        service.flights.currentPage = [];
        $('.controller').hide();
        service.loading = true;
        data = formData;  
        service.errors = {};
        $('#originplaceshadow').trigger('input');
        $('#destinationplaceshadow').trigger('input');
         $('#destinationplacecountry').trigger('input');
        return $http.post("/search",formData).then(setFlights).catch(function(err){
            // check the error message
            console.log(err)
            if(err.data.ValidationErrors) {
               err.data.ValidationErrors.forEach(function(error){
                    if(service.errors[error.Message]) {
                        service.errors[error.Message + "1"] = error.Message + ',' + error.ParameterName;
                    } else {
                        service.errors[error.Message] = error.Message + ',' + (error.ParameterName || '.');
                    }
                }); 
            } else {
                service.errors[err.data] = err.data;
            }
            
        });

    }
      
    function setFlights(result) {
        if(result.data.Status === "UpdatesComplete" && result.data.Itineraries.length === 0) {
            service.errors.dates = 'No results found, please try another dates!!';
            return;
        }
        if(result.data.Status === "UpdatesPending") {
            console.log('poll again')
            return setTimeout(function() {
                            return search(data)
                    }, 1000);
        }
        var agents = {};
        result.data.Agents.forEach(function(agent){
            agents[agent.Id.toString()] = agent.Name;
        })
        var legs = {};
        result.data.Legs.forEach(function(leg){
            legs[leg.Id] = [leg.Arrival, leg.Departure, leg.Directionality, leg.DestinationStation, leg.OriginStation, leg.Carriers, leg.Stops, leg.Duration];
        });
        var places = {};
        result.data.Places.forEach(function(place){
            places[place.Id] = place.Code;
        });

        var carriers = {};
        result.data.Carriers.forEach(function(carrier){
            carriers[carrier.Id] = [carrier.ImageUrl, carrier.Name];
        })
        var id = result.config.url.split('/')[2] || 0;

        service.flights = service.flights || [];
        service.flights[id] =  result.data.Itineraries || service.flights[id];
        service.flights[id] = service.flights[id].map(function(flight,index){
            var outboundId = flight.OutboundLegId;
            var inboundId = flight.InboundLegId;
            var arrival = legs[outboundId][0];
            var departure = legs[outboundId][1];
            var arrivalDate = legs[outboundId][0].split('T')[0];
            var arrivalTime = legs[outboundId][0].split('T')[1].slice(0,5);
            var departureDate = legs[outboundId][1].split('T')[0];
            var departureTime = legs[outboundId][1].split('T')[1].slice(0,5);
            var arrivalR = inboundId && legs[inboundId][0];
            var departureR = inboundId && legs[inboundId][1];
            
            var arrivalRDate = legs[inboundId][0].split('T')[0];
            var arrivalRTime = inboundId && legs[inboundId][0].split('T')[1].slice(0,5);
            var departureRDate = inboundId && legs[inboundId][1].split('T')[0];
            var departureRTime = inboundId && legs[inboundId][1].split('T')[1].slice(0,5);
            var destination = legs[outboundId][3];
            var origin = legs[outboundId][4];
            try {
                var carrierImage = carriers[legs[outboundId][5]][0];
                var carrierImageR = carriers[legs[inboundId][5]][0];
                var carrierName = carriers[legs[outboundId][5]][1];
                var carrierNameR = carriers[legs[inboundId][5]][1];
            }catch(err) {
                var carrierImage = 'http://s1.apideeplink.com/images/airlines/AA.png';
                var carrierImageR = 'http://s1.apideeplink.com/images/airlines/AA.png';
                var carrierName = 'American Airlines';
                var carrierNameR = 'American Airlines';
            }
            try {
                var carrierImage = carriers[legs[outboundId][5]][0];
                var carrierImageR = carriers[legs[inboundId][5]][0];
                var carrierName = carriers[legs[outboundId][5]][1];
                var carrierNameR = carriers[legs[inboundId][5]][1];
            } catch(err) {
                var carrierImage = 'http://s1.apideeplink.com/images/airlines/AA.png';
                var carrierImageR = 'http://s1.apideeplink.com/images/airlines/AA.png';
                var carrierName = 'American Airlines';
                var carrierNameR = 'American Airlines';
            }
            var originStops =  legs[inboundId][6];
            var destinationStops = legs[outboundId][6];
            var outboundDuration = legs[outboundId][7] / 60;
            var inboundDuration = legs[inboundId][7] / 60;
            
            var pricingOptions = {};
//            flight.PricingOptions.map(function(option) {
//               pricingOptions = {agent: agents[option.Agents[0]], price: Math.round(option.Price * 100)/100, DeeplinkUrl: option.DeeplinkUrl}
//            });

            var pricingOptions = {
                'agent': agents[flight.PricingOptions[0].Agents[0]],
                'price': Math.round(flight.PricingOptions[0].Price * 100)/100,
                'DeeplinkUrl': flight.PricingOptions[0].DeeplinkUrl
            }
            service.loading = false;
            var result = {
                    _id: index,
                    arrivalRDate: arrivalRDate,
                    arrivalRTime: arrivalRTime,
                    departureRTime: departureRTime,
                    departureRDate: departureRDate,
                    arrivalDate: arrivalDate,
                    arrivalTime: arrivalTime,
                    departureTime: departureTime,
                    departureDate: departureDate, 
                    carrierName: carrierName,
                    carrierNameR: carrierNameR,
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
            return result;

        });
        
        // to use worker after the presentation
        setTimeout(showController, 50);
        if (id === 0 ) {
            $http.get('/newTicket').then(function(result,err){
                service.journeyId = result.data;
            }).catch(function(err){
                // you need to send a message to the admin to make sure the record is not lost
                console.log(err);
            });    
        }
        
        //you should set up the _id 
        service.flights.currentPage = service.flights[id];
        console.log(new Date)
    }

  }
      
})();