(function(){
    'use strict'
    
    angular.module('app.search')
        .directive('outGreaterThanIn', function() {
            return {
                restrict: 'A',
                require: 'ng-model',
                link: function(scope, elem, attr, ctrl) {
                      ctrl.$parsers.unshift(outGreaterThanIn);
                      
                      function outGreaterThanIn(viewValue){
                          var outboundDate = $('#outboundDate').val();
                        if(!outboundDate) {
                            console.log('outboundDate is not provided')
                            ctrl.$setValidity('outGreaterThanIn',false);
                        }
                        if (Boolean(new Date(viewValue) - new Date(outboundDate) > 0)) {
                          ctrl.$setValidity('outGreaterThanIn',true);
                        }
                        else{
                          ctrl.$setValidity('outGreaterThanIn', false);
                        }
                        return viewValue;
                      }
                }
            }
        });
})()