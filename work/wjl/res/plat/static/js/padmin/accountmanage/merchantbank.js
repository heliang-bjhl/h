// 下拉列表初始化 & 审核对话框 & 审核处理
seajs.use("calendar_css");
seajs.use(["$", 'select', "confirmbox", "calendar","validator","util"], function($, Select, ConfirmBox,Calendar, Validator ,util) {
    var _o = {};
    var _p = {
        getHtml : function(op){
            var html = [
                '<div class="dialog-form">',
                    '<form action="create.aj" id="fromForCreat">',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label>负责人: </label>',
                            '<span class="jForname">',op.head,'</span>',
                        '</div>',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label>登录账号: </label>',
                            '<input class="ui-input ui-input-large jForBank" type="text" value="" name="userName" />',
                        '</div>',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label>登录密码: </label>',
                            '<input class="ui-input ui-input-large jForPassword" type="text" value="" name="passwd" />',
                        '</div>',
                        '<input type="hidden" value="',op.storeid,'" name="storeId" />',
                    '</form>',
                '</div>'
            ].join('');
            return html;
        },
        alsoHtml : function(op){
            var Html2 = [
                '<div class="dialog-form">',
                    '<form action="',op.url,'" id="fromForalso">',
                        '<input type="hidden" name="',op.username,'" value="',op.userval,'" />',
                    '</form>',
                '</div>'
            ].join('');
            return Html2;
        },
        addVal: function(opt){
            var validator = new Validator({
                element: '#fromForCreat',
                onFormValidated: function(err, results, form) {
                    err != true && _p.sb({
                                form : '#fromForCreat',
                                submitButton : '#j_bt_yes'
                            });
                },
                autoSubmit: false,
                failSilently: true
            });
             validator
            .addItem({
                element: 'input[name="userName"]',
                required: true,
                errormessageRequired: '请输入登录账号。'
            })
            .addItem({
                element: 'input[name="passwd"]',
                required: true,
                errormessageRequired: '请输入登录密码。'
            })

        },
        bind : function(){
            $('.jForCreate').on('click',function(){
                var head = $(this).closest('tr').find('td').eq(2).text();
                var storeid = $(this).data('storeid');
                Util.confirm.open({
                    title: '创建账号',
                    message: _p.getHtml({
                        head : head,
                        storeid : storeid
                    }),
                    confirmTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_yes">确定</span>',
                    cancelTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_no">取消</span>',
                    onConfirm: function() { // 通过
                        _p.sb({
                            form: '#fromForCreat',
                            submitButton: '#j_bt_yes'
                        })
                    },
                    onCancel: function() { // 拒绝
                        util.confirm.close();
                    },
                    onClose: function() {

                    }
                });
               _p.addVal();
            });
            $('.jForFreeze').on('click',function(){
                var url = $(this).data('url');
                var userid = $(this).data('userid');
                var usuaname = $(this).data('names');
                Util.confirm.open({
                    title: '是否确认冻结？',
                    message: _p.alsoHtml({
                        url : url,
                        username : usuaname,
                        userval : userid
                    }),
                    width : 300,
                    confirmTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_yes_freez">确定</span>',
                    cancelTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_no_freez">取消</span>',
                    onConfirm: function() { // 通过
                        _p.sb({
                            form: '#fromForalso',
                            submitButton: '#j_yes_freez'
                        })
                    },
                    onCancel: function() { // 拒绝
                        util.confirm.close();
                    },
                    onClose: function() {

                    }
                });
            });
            $('.jForNoFreeze').on('click',function(){
                var url = $(this).data('url');
                var userid = $(this).data('userid');
                var usuaname = $(this).data('names');
                Util.confirm.open({
                    title: '是否确认解冻？',
                    message: _p.alsoHtml({
                        url : url,
                        username : usuaname,
                        userval : userid
                    }),
                    width : 300,
                    confirmTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_yes_freez">确定</span>',
                    cancelTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_no_freez">取消</span>',
                    onConfirm: function() { // 通过
                        _p.sb({
                            form: '#fromForalso',
                            submitButton: '#j_yes_freez'
                        })
                    },
                    onCancel: function() { // 拒绝
                        util.confirm.close();
                    },
                    onClose: function() {

                    }
                });
            });
            $('.jForOnline').on('click',function(){
                var url = $(this).data('url');
                var userid = $(this).data('userid');
                var usuaname = $(this).data('names');
                Util.confirm.open({
                    title: '是否确认上线？',
                    message: _p.alsoHtml({
                        url : url,
                        username : usuaname,
                        userval : userid
                    }),
                    width : 300,
                    confirmTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_yes_freez">确定</span>',
                    cancelTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_no_freez">取消</span>',
                    onConfirm: function() { // 通过
                        _p.sb({
                            form: '#fromForalso',
                            submitButton: '#j_yes_freez'
                        })
                    },
                    onCancel: function() { // 拒绝
                        util.confirm.close();
                    },
                    onClose: function() {

                    }
                });
            });
            $('.jForUnderline').on('click',function(){
                var url = $(this).data('url');
                var userid = $(this).data('userid');
                var usuaname = $(this).data('names');
                Util.confirm.open({
                    title: '是否确认下线？',
                    message: _p.alsoHtml({
                        url : url,
                        username : usuaname,
                        userval : userid
                    }),
                    width : 300,
                    confirmTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_yes_freez">确定</span>',
                    cancelTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_no_freez">取消</span>',
                    onConfirm: function() { // 通过
                        _p.sb({
                            form: '#fromForalso',
                            submitButton: '#j_yes_freez'
                        })
                    },
                    onCancel: function() { // 拒绝
                        util.confirm.close();
                    },
                    onClose: function() {

                    }
                });
            });
            $('.jForRepwd').on('click',function(){
                var url = $(this).data('url');
                var userid = $(this).data('userid');
                var usuaname = $(this).data('names');
                Util.confirm.open({
                    title: '是否确重置密码？',
                    message: _p.alsoHtml({
                        url : url,
                        username : usuaname,
                        userval : userid
                    }),
                    width : 300,
                    confirmTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_yes_freez">确定</span>',
                    cancelTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_no_freez">取消</span>',
                    onConfirm: function() { // 通过
                        _p.sb({
                            form: '#fromForalso',
                            submitButton: '#j_yes_freez'
                        })
                    },
                    onCancel: function() { // 拒绝
                        util.confirm.close();
                    },
                    onClose: function() {

                    }
                });
            });
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
        }
    };
    var init = function(){
        _p.bind();
    };
    init();
	$$m.finish('ok');
});