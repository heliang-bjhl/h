 seajs.use(['util', 'scroll'], function(util,scroll) {
    var _o = {
        subobj: {},
        getUrlParam : function(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r!=null) return unescape(r[2]); return '';
        } 
     };
     _o.addHtml = $('#j_getmore').html();
     $('#j_getmore').html('更多');
    var _p = {
        setDropDown: function(){
            new util.DropDown({
                trigger: 'j_drop1',
                dropBox: 'j_drop1_box'
            });
            new util.DropDown({
                trigger: 'j_drop2',
                dropBox: 'j_drop2_box'
            });
            new util.DropDown({
                trigger: 'j_drop3',
                dropBox: 'j_drop3_box'
            });
         },
         getHtml : function(){
            var start;
            if(!$('#j_getmore').attr('start')){
                $('#j_getmore').attr('start', 5);
                start = 5;
            }else{
                start = parseInt($('#j_getmore').attr('start'));
            }
            $('#j_getmore').html(_o.addHtml);
            _o.aj = new util.Go({
                url : 'waterfallList',
                data : {
                    floor : _o.getUrlParam('floor'),
                    minCost : _o.getUrlParam('minCost'),
                    maxCost : _o.getUrlParam('maxCost'),
                    hasCoup : _o.getUrlParam('hasCoup'),
                    start : start,
                    num : 5
                },
                success : function(data){
                    $('#j_getmore').attr('start', (start + 5));
                    $('.m-list1').append(data);
                    $('#j_getmore').html('更多');
                },
                error : function(){
                    $('#j_getmore').html('更多');
                },
                timeout :function(){
                    $('#j_getmore').html('更多');
                }
            });
         },
         bind : function(){
            $('#j_getmore').closest('.m-load').bind('click',function(){
                _o.aj = null
                _p.getHtml();
            });
            $('#j_top').bind('click', function() {
                 util.goTop();
             });
         },
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
         scrollFix: function() {
             var h = $('#j_scroll').height();
             var t;
             $(document).bind('scroll', function() {
                 var y = $('body').scrollTop();
                 try {
                     clearTimeout(t);
                 } catch (e) {

                 }
                 t = setTimeout(function() {
                     if (y > h) {
                         $('.m-tab').addClass('tabfix');
                         if($('#j_tab').length){
                            $('#j_tab').show()
                         }else{
                            $('.m-tab').after('<div id="j_tab" style="height:44px"></div>')
                         }
                         
                     } else {
                         $('.m-tab').removeClass('tabfix');
                         try{
                            $('#j_tab').hide()
                        }catch(e){}
                     }
                 }, 20)


             })
         },
         _init: function() {
             _p.setDropDown();
             _p.bind();
             _p.setScroll();
             _p.scrollFix();
         }
     }
     _p._init();
 });