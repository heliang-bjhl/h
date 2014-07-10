// 下拉列表初始化 & 审核对话框 & 审核处理
seajs.use("calendar_css");
seajs.use(["$", 'select', "confirmbox","validator", "calendar","util"], function($, Select, ConfirmBox,Validator,Calendar, util) {
    var _o = {};
    var _p = {
        getCreateHtml : function(){
            var html = [
                '<div class="dialog-form">',
                    '<form action="create.aj" id="j_create">',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label>角色名称: </label>',
                            '<input class="ui-input ui-input-large j-role-nameinp" type="text" value="" name="roleName" />',
                        '</div>',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label>角色描述: </label>',
                            '<input class="ui-input ui-input-large j-descriptioninp" type="text" value="" name="description" />',
                        '</div>',
                        '<div><input type="submit" style="display:none;" class="jSubMesg" /></div>',
                    '</form>',
                '</div>'
            ].join('');
            return html;
        },
        addVal: function(opt){
            var validator = new Validator({
                element: '#j_create',
                onFormValidated: function(err, results, form) {
                    err != true && _p.sb({
                                form : '#j_create',
                                submitButton : '#j_bt_yes'
                            });
                },
                autoSubmit: false,
                failSilently: true
            });
             validator
            .addItem({
                element: 'input[name="roleName"]',
                required: true,
                errormessageRequired: '请输入角色名称。'
            })
            .addItem({
                element: 'input[name="description"]',
                required: true,
                errormessageRequired: '请输入角色描述。'
            })

        },
        bind : function(){
            $('#jAddBank').on('click',function(){
                Util.confirm.open({
                    title: '添加角色',
                    message: _p.getCreateHtml(),
                    confirmTpl: '<span class="ui-dialog-button-orange" id="j_bt_yes">确定</span>',
                    cancelTpl: '',
                    onConfirm: function() { // 通过
                        $('body').find('#j_create').trigger('submit');
                    },
                    onCancel:function(){    // 拒绝
                        
                    },
                    onClose : function(){}
                });
                _p.addVal();
            });
        },
        sb : function(op){
            util.formSend(op.form, {
                "ajaxSuccess": function(data) {
                    util.go(data);  
                },
                
                "error": function() {
                    util.alert("操作超时");
                    //dialog.hide();
                },
                submitButton : op.submitButton
            });
        }
    };
    var init = function(){
        _p.bind();
    }
    init();	
    $$m.finish('ok');
});