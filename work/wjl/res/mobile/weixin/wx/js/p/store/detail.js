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
         setScroll2: function() {

             var w = $('#j_scroll2').width();
             
             var len = $('#j_scroll2 .slide').length;
             var itemw = w/2;
             $('#scroller2 .slide').width(itemw);
             $('#scroller2').width(itemw * len);
             
             new scroll('#j_scroll2', {
                 scrollX: true,
                 scrollY: false,
                 momentum: false,
                 snap: '.slide',
                 snapSpeed: 200,
                 keyBindings: true,
                 scrollbars: false
             });


             //document.addEventListener('touchmove', function (e) { e.preventDefault(); }, false);
         },
         _init: function() {
             
             // _p.setScroll();
             _p.setScroll2();
             

         }
     }
     _p._init();
 });
