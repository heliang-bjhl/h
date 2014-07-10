 seajs.use(['util'], function(util) {
 	var _p = {
 		bindform : function(){
 			util.form.sb({
 				form : 'j_form',
 				sb : 'j_sb',
 				extendVal: function(form) { //所有表单默认规则都通过=
 					form.submit();
                }
 			});
 		},
 		_init : function(){
 			_p.bindform();
 		}
 	}
 	_p._init();
 });