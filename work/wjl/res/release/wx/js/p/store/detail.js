 seajs.use(['util', 'scroll'], function(util, scroll) {
     
     var _p = {
         
         setScroll: function() {
             var w = $('#j_scroll').width();
             var len = $('#scroller .slide').length;
             $('#scroller').width(w * len);
             new scroll('#j_scroll', {
                 scrollX: true,
                 scrollY: false,
                 momentum: false,
                 snap: true,
                 snapSpeed: 100,
                 keyBindings: true,
                 indicators: {
                     el: document.getElementById('indicator'),
                     resize: false
                 }
             });
             //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
         },
         _init: function() {
             
             _p.setScroll();
             

         }
     }
     _p._init();
 });
