seajs.use(['util'], function(util) {
	var _o = {
        getUrlParam : function(name){
            var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r!=null) return unescape(r[2]); return '';
        }
    };
 	var _p = {
 		getAjx : function(){
 			_o.aj = new util.Go({
                url : '/aj/activity/getstatus',
                data : {
                    activityId : _o.getUrlParam('activityId')
                },
                success : function(data){
                	if(data.code == 200){
                        var dataObj = data.data;
                        if(dataObj.showapply == '1'){
                            $('#j_canclick').find('.start').show().siblings().hide();
                        }else if(dataObj.showapply == '2'){
                            $('#j_canclick').find('.miss').show().siblings().hide();
                        }else if(dataObj.showapply == '3'){
                            $('#j_canclick').find('.fini').show().siblings().hide();
                        }else if(dataObj.showapply == '4'){
                            $('#j_canclick').find('.sign').show().siblings().hide();
                        }
                	}
                }
            })
 		},
 		_init : function(){
 			_p.getAjx();
 		}
 	}
 	_p._init();
 });