seajs.use(['util', 'scroll'], function(util, scroll) {
    var _o = {};
    _o.FormatData = function(data){
        var str = '';
        str += data.getFullYear() + '/';
        str += (data.getMonth() + 1) + '/';
        str += data.getDate() + ' ';
        str += data.getHours() + ':';
        str += data.getMinutes() + ':';
        str += data.getSeconds();
        return str;   
    }    
     var _p = {
         setBtnClick: function() {
             var currentTime = _o.FormatData(new Date());
             var DataStart = $('#pullStart').val().split('-').join('/');
             var DataEnd = $('#pullEnd').val().split('-').join('/');
             if( Date.parse(new Date(DataStart)) > Date.parse(new Date(currentTime)) ){
                $('#tobuy').attr('href','javascript:void(0);').text('未到领取时间').closest('.m-bt3').addClass('m-nbt');
             }
             if( Date.parse(new Date(currentTime)) > Date.parse(new Date(DataEnd)) ){
                $('#tobuy').attr('href','javascript:void(0);').text('已过领取时间 ').closest('.m-bt3').addClass('m-nbt');
             }
             $('#tobuy').css({
                display : 'block'
             });
         },
         _init: function() {
             _p.setBtnClick();

         }
     }
     _p._init();
});
