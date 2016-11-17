(function() {
    'use strict';

    angular
        .module('app.getFlights')
        .factory('getFlights', getFlights);

    getFlights.$inject = ["$http", "$q", "$routeParams"];

    function getFlights($http, $q, $routeParams) {
        var service = {
            search: search,
            flights: {},
            orderNextPage: orderNextPage,
            orderPreviousPage: orderPreviousPage,
            errors: {},
            journeyId: null,
            loading: false,
            currency: 'U',
            page: currentParam
        };

        return service;

        ////////////
        var data = [];
        
        function currentParam() {
            return parseInt($routeParams.id, 10);
        }

        function orderNextPage() {
            var page = service.page() + 1;
            service.loading = true;
            page >= 0 ? page = page : page = 0;
            $http.get("/pollSession/" + page).then(setFlights).then(function() {
                location.hash = 'search/' + page;
            }).catch(function(err) {
                console.log(err);
                service.errors[err.data] = err.data;
                service.loading = false;
            })
        }

        function showController() {
            $('.controller').show();
            $("html, body").animate({
                scrollTop: 300
            }, 900);
        }

        function orderPreviousPage() {
            var page = service.page() - 1;
            service.loading = true;
            $http.get("/pollSession/" + page).then(setFlights).then(function() {
                location.hash = 'search/' + page;
            }).catch(function(err) {
                console.log(err);
                service.errors[err.data] = err.data;
                service.loading = false;
            })
        }

        function search(formData) {
            service.flights.currentPage = [];
            if (formData.currency === "USD") {
                service.currency = "$";
            } else {
                service.currency = "€";
            }

            $('.controller').hide();
            service.loading = true;
            data = formData;
            service.errors = {};
            $('#originplaceshadow').trigger('input');
            $('#destinationplaceshadow').trigger('input');
            $('#destinationplacecountry').trigger('input');
            return $http.post("/search", formData).then(setFlights).catch(function(err) {
                // check the error message
                console.log(err)
                if (err.data.ValidationErrors) {
                    err.data.ValidationErrors.forEach(function(error) {
                        if (service.errors[error.Message]) {
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

        function sortMainParameters(result) {
            var mainObjects = {};
            var agents = {};
            var legs = {};
            var places = {};
            var carriers = {};

            result.data.Agents.forEach(function(agent) {
                agents[agent.Id.toString()] = agent.Name;
            })
            mainObjects.agents = agents;

            result.data.Legs.forEach(function(leg) {
                legs[leg.Id] = [leg.Arrival, leg.Departure, leg.Directionality, leg.DestinationStation, leg.OriginStation, leg.Carriers, leg.Stops, leg.Duration];
            });
            mainObjects.legs = legs;

            result.data.Places.forEach(function(place) {
                places[place.Id] = place.Code;
            });
            mainObjects.places = places;

            result.data.Carriers.forEach(function(carrier) {
                carriers[carrier.Id] = [carrier.ImageUrl, carrier.Name];
            });
            mainObjects.carriers = carriers;

            return mainObjects;
        }

        function setFlights(result) {
            if (result.data.Status === "UpdatesComplete" && result.data.Itineraries.length === 0) {
                service.errors.dates = 'No results found, please try another dates!!';
                return;
            }

            if (result.data.Status === "UpdatesPending") {
                return setTimeout(function() {
                    return search(data)
                }, 1000);
            }

            var mainObject = sortMainParameters(result);
            var id = result.config.url.split('/')[2] || 0;
            var nowDate = new Date;
            service.flights = service.flights || [];
            service.flights[id] = result.data.Itineraries || service.flights[id];
            service.flights[id] = service.flights[id].map(function(flight, index) {
                return setFlightsObject(flight, index, mainObject);
            });

            setTimeout(showController, 50);
            if (id === 0) {
                $http.get('/newTicket').then(function(result, err) {
                    service.journeyId = result.data;
                }).catch(function(err) {
                    // you need to send a message to the admin to make sure the record is not lost
                    console.log(err);
                });
            }

            service.flights.currentPage = service.flights[id];
        }

        function setFlightsObject(flight, index, mainObject) {
            var outboundId = flight.OutboundLegId;
            var inboundId = flight.InboundLegId;
            var legs = mainObject.legs;
            var carriers = mainObject.carriers;
            var places = mainObject.places;
            var agents = mainObject.agents;

            try {
                var carrierImage = carriers[legs[outboundId][5]][0];
                var carrierImageR = carriers[legs[inboundId][5]][0];
                var carrierName = carriers[legs[outboundId][5]][1];
                var carrierNameR = carriers[legs[inboundId][5]][1];
            } catch (err) {
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
            } catch (err) {
                var carrierImage = 'http://s1.apideeplink.com/images/airlines/AA.png';
                var carrierImageR = 'http://s1.apideeplink.com/images/airlines/AA.png';
                var carrierName = 'American Airlines';
                var carrierNameR = 'American Airlines';
            }

            var pricingOptions = {
                'agent': agents[flight.PricingOptions[0].Agents[0]],
                'price': service.currency + " " + Math.round(flight.PricingOptions[0].Price * 100) / 100,
                'DeeplinkUrl': flight.PricingOptions[0].DeeplinkUrl,
                priceNoCurrency: Math.round(flight.PricingOptions[0].Price * 100) / 100
            }

            service.loading = false;
            var originStops = legs[inboundId][6].reduce(function(originStops, start) {
                originStops.push(places[start])
                return originStops;
            }, []);

            var destionationStops = legs[outboundId][6].reduce(function(destinationStops, start) {
                destinationStops.push(places[start]);
                return destinationStops;
            }, []);
            var result = {
                _id: index,
                arrivalRDate: legs[inboundId][0].split('T')[0],
                arrivalRTime: inboundId && legs[inboundId][0].split('T')[1].slice(0, 5),
                departureRTime: inboundId && legs[inboundId][1].split('T')[1].slice(0, 5),
                departureRDate: inboundId && legs[inboundId][1].split('T')[0],
                arrivalDate: legs[outboundId][0].split('T')[0],
                arrivalTime: legs[outboundId][0].split('T')[1].slice(0, 5),
                departureTime: legs[outboundId][1].split('T')[1].slice(0, 5),
                departureDate: legs[outboundId][1].split('T')[0],
                carrierName: carrierName,
                carrierNameR: carrierNameR,
                destination: places[legs[outboundId][3]],
                origin: places[legs[outboundId][4]],
                pricingOptions: pricingOptions,
                inboundDuration: Math.round(legs[inboundId][7] / 60),
                outboundDuration: Math.round(legs[outboundId][7] / 60),
                carrierImage: carrierImage,
                carrierImageR: carrierImageR,
                originStops: originStops,
                originStopsLength: originStops.length,
                destinationStops: destionationStops,
                destinationStopsLength: destionationStops.length
            };
            return result;
        }

    }

})();