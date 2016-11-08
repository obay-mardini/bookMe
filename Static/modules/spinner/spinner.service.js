(function() {
  'use strict';

  angular
    .module('app.spinner')
    .factory('spinner', spinner);


    function spinner() {
        var service = {
            start: start
        };
        
        return service;
        
        /////////
        function start() {
            var ticker = document.getElementById('ticker');
      var n = 0;
      var myAnimationFrame;

        myAnimationFrame = window.requestAnimationFrame(anim);

        function anim() {
          n += 1;
          if (n % 3 === 0) {
              ticker.style.transform = 'translateX(' + n + 'px)';
          } else if (n > document.body.offsetWidth) {
              n = 0;
              ticker.style.transform = 'translateX(' + n + 'px)';
           }
           myAnimationFrame = window.requestAnimationFrame(anim);
         }
        }
      
    }
})();