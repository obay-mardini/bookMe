(function(){
    'use strict'
    
    angular.module('app.search')
        .directive('dateCheck', function() {
            return {
                restrict: 'A',
                require: 'ng-model',
               
                link: function(scope, elem, attr, ctrl) {
                    
                    ctrl.$parsers.unshift(dateCheck);
                  function dateCheck(viewValue){
                    console.log(Boolean(new Date(viewValue) - new Date() > 0))
                    if (Boolean(new Date(viewValue) - new Date() < (365*24*60*60*1000)) || Boolean(new Date(viewValue) - new Date() > 0)) {
                        ctrl.$setValidity('dateCheck',true);
                    }
                    else{
                      ctrl.$setValidity('dateCheck', false);
                    }
                    return viewValue;
                  }
                }
            }
        });
})()

