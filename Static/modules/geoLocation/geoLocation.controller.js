(function() {
    'use strict'

    angular
        .module('app.geoLocation')
        .factory('GeoLocationController', GeoLocationController);

    GeoLocationController.$inject = ['$q', '$http'];

    function GeoLocationController($q, $http) {
        var service = {
            city: userCity
        }

        return service;
        ////////


        function userCity() {
            var deffered = $q.defer();
            $http.get('http://ip-api.com/json').success(function(coordinates) {
                deffered.resolve({
                    city: coordinates.city,
                    country: coordinates.country
                })
            }).error(function(err) {
                deffered.reject(err);
            });
            return deffered.promise;
        }

    }
})();