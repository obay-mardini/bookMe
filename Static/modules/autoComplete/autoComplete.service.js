(function() {
  'use strict';

  angular
    .module('app.autoComplete')
    .factory('autoComplete', autoComplete);

  autoComplete.$inject = ["$http", "$q"];

  function autoComplete($http, $q) {

    var service = {
       cancelSuggestions: cancelSuggestions,
       currentInputElement: currentInputElement,
//       chooseSuggestion: chooseSuggestion,
       active: active,
       inActive: inActive,
        predict: predict,
        input: {input: null},
        suggestions: {suggestions: null},
        noS: noS,
        error: {value: null}
    };

    return service;

    ////////////
      
    var noSuggestions = true;
      
    function noS() {
        return noSuggestions;
    }
    
    function capitalizeFirstLetter(word) {
        return word[0].toUpperCase() + word.slice(1);
    }
      
    function cancelSuggestions(element) {
        var currentValue = $(element).val()
        var capitalizedVersion = [];
        currentValue.split(' ').forEach(function(currentWord) {
            capitalizedVersion.push(capitalizeFirstLetter(currentWord));
        });
        try {
            var skyId = service.suggestions.suggestions.find(function(suggestion) {
                return suggestion.PlaceName === capitalizedVersion.join(' ');
            }).PlaceId;
        } catch(err) {
            return 'please enter a valid city name'
        }
        
        $(element + 'shadow').val(skyId); 
        noSuggestions = true;
    }

    function currentInputElement(element) {
        service.input.input = element;
        noSuggestions = false;
    }
      
//    function chooseSuggestion(element) {
//        $(service.input.input).val($(element.target).html()); 
//        console.log(element.target)
//    }

    function active(element) {
        $(service.input.input).val($(element.target).html());
        $(service.input.input + 'shadow').val($(element.target).attr('data-skyscannervalue')); 
        $(element.currentTarget).addClass('currentSuggestion');
    }

    function inActive(element) {
        $(element.currentTarget).removeClass('currentSuggestion');
    }

    function predict(quess) {
        noSuggestions = false;
        service.suggestions.suggestions = null;
        var deferred = $q.defer();
        $http.post("/predict",{link: 'http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/UK/USD/en-GB/?query=' + quess}).success(function(result) {
            service.suggestions.suggestions = service.suggestions.suggestions || [];
            result.Places.forEach(function(place){
                service.suggestions.suggestions.push({'PlaceName':place.PlaceName, 'PlaceId': place.PlaceId});
            });
            deferred.resolve();
        }).error(function(err){
            deferred.reject(err);
        });
        return deferred.promise;
    }
  }
      
})();