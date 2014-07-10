 seajs.use(['util'], function(util) {
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
                url : 'mycouponpart',
                data : {
                    start : start,
                    num : 5
                },
                success : function(data){
                    $('#j_getmore').attr('start', (start + 5));
                    $('.m-list4').append(data);
                    $('#j_getmore').html('更多');
                },
                error : function(){
                    $('#j_getmore').html('更多');
                },
                timeout :function(){
                    $('#j_getmore').html('更多');
                }
            })
         },
         bind : function(){
            $('#j_getmore').closest('.m-load').bind('click',function(){
                _o.aj = null
                _p.getHtml();
            });
         },
         _init: function(){
             _p.bind();
         }
     }
     _p._init();
 });