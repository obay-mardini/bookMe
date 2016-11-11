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
            active: active,
            inActive: inActive,
            predict: predict,
            input: {
                input: null
            },
            suggestions: {
                suggestions: null
            },
            noS: noS,
            error: {
                value: null
            },
            call: call
        };

        return service;

        ////////////
        var noSuggestions = true;
        var autoCompleteEvents = false;
        var current = -1;
        
        function call() {
            var suggestions = document.getElementsByClassName('inSuggestions');
            if(autoCompleteEvents) {
                return;
            }
            
            document.addEventListener('keydown', arrowTracker)
            autoCompleteEvents = true;
            function arrowTracker(e) {
                var suggestions = document.getElementsByClassName('inSuggestions');
                var suggestionsLength;
                
                if(e.keyCode === 13) {
                    if(service.input.input !== null) {
                        e.preventDefault();
                        if(service.input.input === '#originplace') {
                            cancelSuggestions('#originplace');
                            $('#destinationplace').focus();
                        } else {
                            cancelSuggestions('#destinationplace');
                            $('#outboundDate').focus();
                        }
                        return false;
                    }
                
                }
                if (e.keyCode === 38 || e.keyCode === 40) {
                  
                    if(service.input.input === null) {
                        current = -1;
                        return;
                    }

                    if (service.input.input === '#destinationplace'){
                        suggestions = Array.prototype.slice.call(suggestions, suggestions.length / 2)
                    } else {
                        suggestions = Array.prototype.slice.call(suggestions, 0, suggestions.length / 2)
                    }
                }
                // down arrow
                if (e.keyCode == 40) {
                    if (current >= (suggestions.length) - 1) {
                        $(suggestions[current]).removeClass('currentSuggestion');
                        current = 0;
                    } else if (current >= 0) {
                        $(suggestions[current]).removeClass('currentSuggestion');
                        current++;
                    } else {
                        current = 0;
                    }
      
                    active(suggestions[current]);
                }
                if (e.keyCode == 38) {

                    if (current === 0) {
                        $(suggestions[current]).removeClass('currentSuggestion');
                        current = (suggestions.length) - 1;
                    } else if (current > 0) {
                        $(suggestions[current]).removeClass('currentSuggestion');
                        current--;
                    } else {
                        current = 0;
                        //return;
                    }

                    active(suggestions[current]);
                }
            }
        }

        function noS() {
            return noSuggestions;
        }

        function capitalizeFirstLetter(word) {
            return word[0].toUpperCase() + word.slice(1);
        }

        function cancelSuggestions(element) {
            var currentValue = $(element).val()
            var capitalizedVersion = [];
            current = -1;
            currentInputElement(null)
            currentValue.split(' ').forEach(function(currentWord) {
                capitalizedVersion.push(capitalizeFirstLetter(currentWord));
            });
            try {
                var skyId = service.suggestions.suggestions.find(function(suggestion) {
                    return suggestion.PlaceName === capitalizedVersion.join(' ');
                });
            } catch (err) {
                return 'please enter a valid city name'
            }

            $(element + 'shadow').val(skyId.PlaceId);
            if (element === "#destinationplace") {
                $('#destinationplacecountry').val(skyId.CountryName);
            }
            noSuggestions = true;
            return ''
        }

        function currentInputElement(element) {
            if (element === null) {
                noSuggestions = true;
                service.input.input = element;
                return;
            }
            var inputElement = document.getElementById(element.slice(1));
            var suggestionsList;
            service.input.input = element;
            if (element === '#destinationplace') {
                suggestionsList = document.getElementsByClassName('suggestions')[1];
                suggestionsList.style.left = inputElement.getBoundingClientRect().left + 'px';
                suggestionsList.style.top =  inputElement.getBoundingClientRect().bottom - 10 + 'px';
            } else {
                suggestionsList = document.getElementsByClassName('suggestions')[0];
                suggestionsList.style.left = inputElement.getBoundingClientRect().left + 'px';
                suggestionsList.style.top =  inputElement.getBoundingClientRect().bottom - 10 + 'px'
            }

            noSuggestions = false;
        }

        function active(element) {
            if ($(element.target).length) {
                var toBeAtive = $(element.target) || $(element);
                var currentTarget = $(element.currentTarget) || element;
            } else {
                var toBeAtive = $(element);
                var currentTarget = element;
            }

            var elementHtml = toBeAtive.html();
            var skyscannervalue = toBeAtive.attr('data-skyscannervalue')
            $(service.input.input).val(elementHtml);
            $(service.input.input + 'shadow').val(skyscannervalue);
            $(currentTarget).addClass('currentSuggestion');
            if (service.input.input === "#destinationplace") {
                $("#destinationplacecountry").val(toBeAtive.attr('countryname'))
            }
        }

        function inActive(element) {
            $(element.currentTarget).removeClass('currentSuggestion');
        }

        function predict(quess) {
            noSuggestions = false;
            current = -1;
            service.suggestions.suggestions = null              ;
            var deferred = $q.defer();
            $http.post("/predict", {
                link:        'http://partners.api.skyscanner.net/apiservices/autosuggest/v1.0/UK/USD/en-GB/?query=' + quess
            }).success(function(result) {
                service.suggestions.suggestions = service.suggestions.suggestions || [];
                result.Places.forEach(function(place) {
                    service.suggestions.suggestions.push({
                        'PlaceName': place.PlaceName,
                        'PlaceId': place.PlaceId,
                        'CountryName': place.CountryName
                    });
                });
                deferred.resolve();
            }).error(function(err) {
                deferred.reject(err);
            });
            return deferred.promise;
        }
    }

})();