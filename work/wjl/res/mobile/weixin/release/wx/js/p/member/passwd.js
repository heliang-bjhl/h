 seajs.use(['util'], function(util) {
 	var _p = {
 		bindform : function(){
 			util.form.sb({
 				form : 'j_form',
 				sb : 'j_sb',
 				extendVal: function(form) { //所有表单默认规则都通过
 					if($('.j_samepwd1').val() == $('.j_samepwd2').val()){
 						form.submit();
 					}else{
 						$('.extenderrmsg').empty().append('两次输入不一致！');
 					}
                }
 			});
 		},
 		_init : function(){
 			_p.bindform();
 		}
 	}
 	_p._init();
 });