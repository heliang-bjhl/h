// 下拉列表初始化 & 审核对话框 & 审核处理
seajs.use(["$","confirmbox","util"], function($,ConfirmBox,util) {
	var _o = {};
	var _p = {
		getHtml : function(tickno){
            var pwdhtml = [
                '<div class="dialog-form">',
                    '<form action="usetick.aj" id="j_resetpwd">',
                        '<div class="ui-form-item dialog-form-item">',
                            '确认对该优惠券进行核销？',
                            '<input type="hidden" name="tickno" value="',tickno,'" />',
                        '</div>',
                    '</form>',
                '</div>'
            ].join('');
            return pwdhtml;
        },
		bind : function(){
			
			$('.jifverifi').on('click',function(){
				var tickno = $(this).data('tickno');
				var html = _p.getHtml(tickno);
                Util.confirm.open({
                    title: '优惠券核销',
                    message: html,
                    confirmTpl: '<span class="ui-dialog-button-orange" id="j_bt_yes">确定</span>',
                    cancelTpl: '<span class="ui-dialog-button-orange" id="j_bt_no">取消</span>',
                    onConfirm: function() { // 通过
                        _p.sb({
                            form : '#j_resetpwd',
                            submitButton : '#j_bt_yes'
                        })
                        $('body').find('.ui-poptip,.ui-poptip-white').css({zIndex: 1100});
                        util.confirm.close();
                    },
                    onCancel:function(){    // 拒绝
                        util.confirm.close();
                    },
                    onClose : function(){
                        
                    }
                });
            });
		},
        sb : function(op){
            util.formSend(op.form, {
                "ajaxSuccess": function(data) {
                    util.go(data); 
                },
                
                "error": function(data) {
                    util.alert("操作超时");
                    //dialog.hide();
                },
                submitButton : op.submitButton
            });
        }
	};
	var init = function(){
		_p.bind();
	};
	init();
	$$m.finish('ok');
});