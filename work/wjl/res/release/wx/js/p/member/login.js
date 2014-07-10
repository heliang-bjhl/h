 seajs.use(['util'], function(util) {
 	var _p = {
 		bindform : function(){
 			util.form.sb({
 				form : 'j_form',
 				sb : 'j_sb'
 			});	
 		},
 		_init : function(){
 			_p.bindform();
 		}
 	}
 	_p._init();
 });