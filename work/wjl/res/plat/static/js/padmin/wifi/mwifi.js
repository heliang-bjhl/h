seajs.use("calendar_css");
seajs.use(["$","util", "calendar","select","confirmbox"], function($,util, Calendar,Select,ConfirmBox) {
    var _o = {};
    var _p = {
        setSel : function(){
            _o.mounth1 = new Select({
                trigger: '#j_selChannel'
            }).render();
            _o.mounth2 = new Select({
                trigger: '#j_selState'
            }).render();
        },
        getTopHtml : function(dataid){
            var Html = [
                '<div class="dialog-form">',
                    '<form action="stickyUpdate" method="post" id="j_createToFrm">',
                    '<p>是否确认置顶？</p>',
                    '<input type="hidden" value="', dataid, '" name="id" />',
                    '</form>',
                '</div>'
            ].join("");
            return Html;
        },
        getUpHtml : function(dataid){
            var Html = [
                '<div class="dialog-form">',
                    '<form action="onlineUpdate" method="post" id="j_createUpFrm">',
                    '<p>是否确认上线？</p>',
                    '<input type="hidden" value="', dataid, '" name="id" />',
                    '</form>',
                '</div>'
            ].join("");
            return Html;
        },
        getUnderHtml : function(dataid){
            var Html = [
                '<div class="dialog-form">',
                    '<form action="offlineUpdate" method="post" id="j_createUnderFrm">',
                    '<p>是否确认下线？</p>',
                    '<input type="hidden" value="', dataid, '" name="id" />',
                    '</form>',
                '</div>'
            ].join("");
            return Html;
        },
        sb : function(op){
            util.formSend(op.form, {
                "ajaxSuccess": function(data) {
					if(data.code == 200){
						util.go(data); 
					}else{
						setTimeout(function(){
							$('body').find('.ui-poptip').show();
							setTimeout(function(){
								$('body').find('.ui-poptip').hide();
							},1000);
						},200);
					}
                },
                
                "error": function() {
                    util.alert("操作超时");
                    //dialog.hide();
                },
                submitButton : op.submitButton
            });
        },
        bind : function(){
            $('.j_setUp').on('click',function(){
                var dataid = $(this).closest('tr').data('id');
                Util.confirm.open({
                    title: '确认上线',
                    message: _p.getUpHtml(dataid),
                    confirmTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_yes">确定</span>',
                    cancelTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_no">取消</span>',
                    width:300,
                    onConfirm: function() { // 通过
                        _p.sb({
                            form: '#j_createUpFrm',
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
            $('.j_setUnder').on('click',function(){
                var dataid = $(this).closest('tr').data('id');
                Util.confirm.open({
                    title: '确认下线',
                    message: _p.getUnderHtml(dataid),
                    confirmTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_Unyes">确定</span>',
                    cancelTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_Unno">取消</span>',
                    width:300,
                    onConfirm: function() { // 通过
                        _p.sb({
                            form: '#j_createUnderFrm',
                            submitButton: '#j_bt_Unyes'
                        })
                    },
                    onCancel: function() { // 拒绝
                        util.confirm.close();
                    },
                    onClose: function() {

                    }
                });
            });
            $('.j_setTop').on('click',function(){
                var dataid = $(this).closest('tr').data('id');
                Util.confirm.open({
                    title: '确认置顶',
                    message: _p.getTopHtml(dataid),
                    confirmTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_Toyes">确定</span>',
                    cancelTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_Tono">取消</span>',
                    width:300,
                    onConfirm: function() { // 通过
                        _p.sb({
                            form: '#j_createToFrm',
                            submitButton: '#j_bt_Toyes'
                        })
                    },
                    onCancel: function() { // 拒绝
                        util.confirm.close();
                    },
                    onClose: function() {

                    }
                });
            });
        }
    }
    var init = function() {
        _p.setSel();
        _p.bind();
    }
    init();
    $$m.finish('ok');
});
