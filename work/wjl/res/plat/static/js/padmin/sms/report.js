seajs.use("calendar_css");
seajs.use(["$",'select', 'util','calendar','confirmbox'], function($,Select, util,Calendar,ConfirmBox) {
	var _o = {};
	var _p ={
		setCal : function(){
			//日历控件
            var c1 = new Calendar({
                trigger: '#z_startDate'
            });
            var c2 = new Calendar({
                trigger: '#z_endDate'
            });
            c1.on('selectDate', function(date) {
                c2.range([date, null]);
            });
            c2.on('selectDate', function(date) {
                c1.range([null, date]);
            });
		},
		getHtml : function(dataid){
			var stopsendHtml = [
                '<div class="dialog-form">',
                '<form action="/t/sms/cancel" id="j_fall">',
                '<p>是否确认终止发送？</p>',
                '<input type="hidden" value="', dataid, '" name="serialId" />',
                '</form>',
                '</div>'
            ].join("");
            return stopsendHtml;
		},
        sb: function(op) {
            util.formSend(op.form, {
                "ajaxSuccess": function(data) {
                    util.go(data);
                },

                "error": function() {
                    util.alert("操作超时");
                    //dialog.hide();
                },
                submitButton: op.submitButton
            });
        },
		bind : function(){
			$('.z_stop_send').on('click',function(){
				var dataid = $(this).data('id');
				Util.confirm.open({
                    title: '确认操作',
                    message:_p.getHtml(dataid),
                    confirmTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_yes">确定</span>',
                    cancelTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_no">取消</span>',
                    width:300,
                    onConfirm: function() { // 通过
                        _p.sb({
                            form: '#j_fall',
                            submitButton: '#j_bt_yes'
                        })
                    },
                    onCancel: function() { // 拒绝
                        util.confirm.close();
                    },
                    onClose: function() {

                    }
                });
			});
            $('.hidetxtcon').hover(function(){
                $(this).find('div p').show();
            },function(){
                $(this).find('div p').hide();
            });
		}
	};
	var init = function(){
		_p.setCal();
		_p.bind();
	};
	init();
    $$m.finish('ok');
});