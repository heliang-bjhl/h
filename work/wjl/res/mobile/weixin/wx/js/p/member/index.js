seajs.use(['util'], function(util) {
	var _o = {};
 	var _p = {
 		getAjx : function(){
 			_o.aj = new util.Go({
                url : '/aj/sign/points',
                type : 'POST',
                data : {},
                success : function(data){
                	if(data.code == 200){
                		var num = data.data.points
                		$('#member_points').empty().append(num)
                	}
                }
            })
 		},
 		getAjx2 : function(){
            _o.aj2 = new util.Go({
                url : '/aj/sign/calsignpoints',
                type : 'POST',
                data : {},
                success : function(data){
                    if(data.code == 200){
                        if(!data.data.allow_sign){
                            _o.canbeclick = false;
                            $('#member_sign').empty().append('已签到 (明天送' + data.data.getpoints + '积分)');
                            _p.getAjx();
                            $('#member_sign').closest('.m-bt3').addClass('m-nbt1');
                        }else{
                            _o.canbeclick = data.data;
                            $('#member_sign').empty().append('今日签到 (送' + data.data.getpoints + '积分)');
                        }
                    }
                }
            })
        },
        getAjx3 : function(){
            _o.aj2 = new util.Go({
                url : '/aj/msg/msgsum',
                type : 'POST',
                data : {},
                success : function(data){
                    if(data.code == 200){
                        $('#msgsum').text( '消息中心(' + data.data.msgsum + ')' );
                    }
                }
            })
        },
 		bind : function(){
 			$('#member_sign').on(util.click,function(){
 				if(_o.canbeclick){
 					new util.Go({
					    url: '/aj/sign/signon',
					    data: _o.canbeclick,
                        type : 'POST',
					    success: function(data) {
					        if (data.code == 200) {
					            _p.getAjx2();
					        }
					    }
					})
 				}else{
 					return;
 				}
 			});
 		},
 		_init : function(){
 			_p.getAjx();
 			_p.getAjx2();
            _p.getAjx3();
 			_p.bind();
 		}
 	}
 	_p._init();
 });