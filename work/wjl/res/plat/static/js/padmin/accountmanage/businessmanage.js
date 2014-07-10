// 下拉列表初始化 & 审核对话框 & 审核处理
seajs.use("calendar_css");
seajs.use(["$", 'select', "confirmbox", "calendar","util"], function($, Select, ConfirmBox,Calendar, util) {
    var _o = {
        dialogS1 : null,
        dialogS2 : null
    }
    var _p = {
        setSlt : function(){
            new Select({
                trigger: '#jRole'
            }).render();
            new Select({
                trigger: '#jTypeSel'
            }).render();
        },
        getCreateHtml : function(){
            var w,s;
            //$('#j-branch').html('')
            if($('#j-branch').length && $('#j-branch').html() !== ''){
                w = '',
                s = ['<select id="jAddDepartment" name="dept">',
                                $('#j-branch').html(),
                            '</select>'].join('')
            }else{
                w = '无',
                s = ''
            }
            var html = [
                '<div class="dialog-form">',
                    '<form action="create.aj" id="j_create">',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label>员工姓名: </label>',
                            '<input class="ui-input ui-input-large m-numFnull" type="text" value="" name="realName" />',
                        '</div>',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label>所属部门: </label>',
                            w,
                            s,
                        '</div>',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label>登录账号: </label>',
                            '<input placeholder="请输入姓名全拼" class="ui-input ui-input-large m-numFnull" type="text" value="" name="userName" />',
                        '</div>',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label>登录密码: </label>',
                            '<input class="ui-input ui-input-large m-numFnull" type="text" value="" name="passwd" />',
                        '</div>',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label>角色设置: </label>',
                            '<select id="jAddRole" name="roleId">',
                                $('#j-role').html(),
                            '</select>',
                        '</div>',
                    '</form>',
                '</div>'
            ].join('');
            return html;
        },
        getResetPwdHtml : function(userId){
            var pwdhtml = [
                '<div class="dialog-form">',
                    '<form action="resetpwd.aj" id="j_resetpwd">',
                        '<div class="ui-form-item dialog-form-item">',
                            '是否确定重置密码？',
                        '</div>',
                        '<input type="hidden" name="id" value="',userId,'" />',
                    '</form>',
                '</div>'
            ].join('');
            return pwdhtml;
        },
        getFreeze : function(userId){
            var pwdhtml = [
                '<div class="dialog-form">',
                    '<form action="freeze.aj" id="j_resetpwd">',
                        '<div class="ui-form-item dialog-form-item">',
                            '是否确定冻结账户？',
                        '</div>',
                        '<input type="hidden" name="id" value="',userId,'" />',
                    '</form>',
                '</div>'
            ].join('');
            return pwdhtml;
        },
        getEnable : function(userId){
            var pwdhtml = [
                '<div class="dialog-form">',
                    '<form action="enable.aj" id="j_resetpwd">',
                        '<div class="ui-form-item dialog-form-item">',
                            '是否确定解冻账户？',
                        '</div>',
                        '<input type="hidden" name="id" value="',userId,'" />',
                    '</form>',
                '</div>'
            ].join('');
            return pwdhtml;
        },
        getChanHtml : function(op){
            var w,s;
            //$('#j-branch').html('')
            if($('#j-branch').length && $('#j-branch').html() !== ''){
                if(op.selcon1){
                    $('#j-branch').find('option').each(function(){
                        if($(this).text() == op.selcon1){
                            $(this).attr('selected','selected').siblings().attr('selected','');
                        }
                    });
                }

                    
                w = '',
                s = ['<select id="jAddDepartment" name="dept">',
                                $('#j-branch').html(),
                            '</select>'].join('')
            }else{
                w = '无',
                s = ''
            }
            if(op.selcon2){
                $('#j-role').find('option').each(function(){
                    if($(this).text() == op.selcon2){
                        $(this).attr('selected',true).siblings().attr('selected',false);
                    }
                });
            }
            var html = [
                '<div class="dialog-form">',
                    '<form action="create.aj" id="j_create">',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label>员工姓名: </label>',
                            '<span>',op.jobname,'</span>',
                            '<input type="hidden" name="userId" value="',op.userid,'" />',
                        '</div>',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label>所属部门: </label>',
                            w,
                            s,
                        '</div>',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label>登录账号: </label>',
                            '<span>',op.username,'</span>',
                        '</div>',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label>角色设置: </label>',
                            '<select id="jAddRole" name="roleId">',
                                $('#j-role').html(),
                            '</select>',
                        '</div>',
                    '</form>',
                '</div>'
            ].join('');
            return html;
        },
        setDialogSlt : function(){
            try{
                _o.dialogS1 = new Select({
                    trigger: '#jAddDepartment',
                    zIndex:9999
                }).render();
            }catch(e){

            }

            _o.dialogS2 = new Select({
                trigger: '#jAddRole',
                zIndex:9999
            }).render(); 
        },
        bind : function(){
            $('#jAddBank').on('click',function(){
                Util.confirm.open({
                    title: '员工姓名',
                    message: _p.getCreateHtml(),
                    confirmTpl: '<span class="ui-dialog-button-orange" id="j_bt_yes">确定</span>',
                    cancelTpl: '',
                    onConfirm: function() { // 通过
                        var bFlag = true;
                        $('body').find('.m-numFnull').each(function(){
                            if(!$(this).val()){
                                bFlag = false;
                            }
                        });
                        if(!bFlag){
                            alert('请输入完整信息！');
                        }else{
                            _p.sb({
                                form : '#j_create',
                                submitButton : '#j_bt_yes'
                            })
                        }                            
                    },
                    onCancel:function(){    // 拒绝
                        
                    },
                    onClose : function(){
                        try{util.delSelect(_o.dialogS1);}catch(e){}
                       
                       util.delSelect(_o.dialogS2);
                    }
                });
                _p.setDialogSlt();
            });
            $('.j-repwd').on('click',function(){
                var userId = $(this).closest('tr').data('id');
                Util.confirm.open({
                    title: '重置密码',
                    message: _p.getResetPwdHtml(userId),
                    width: 300,
                    confirmTpl: '<span class="ui-button ui-button-mblue" id="j_bt_yes">确定</span>',
                    cancelTpl: '<span class="ui-button ui-button-mblue" id="j_bt_no">取消</span>',
                    onConfirm: function() { // 通过
                        _p.sb({
                            form : '#j_resetpwd',
                            submitButton : '#j_bt_yes'
                        })
                    },
                    onCancel:function(){    // 拒绝
                        util.confirm.close();
                    },
                    onClose : function(){
                       
                    }
                });
            });
            $('.j-freeze').on('click',function(){
                var userId = $(this).closest('tr').data('id');
                Util.confirm.open({
                    title: '冻结账户',
                    message: _p.getFreeze(userId),
                    width: 300,
                    confirmTpl: '<span class="ui-button ui-button-mblue" id="j_bt_yes">确定</span>',
                    cancelTpl: '<span class="ui-button ui-button-mblue" id="j_bt_no">取消</span>',
                    onConfirm: function() { // 通过
                        _p.sb({
                            form : '#j_resetpwd',
                            submitButton : '#j_bt_yes'
                        })
                    },
                    onCancel:function(){    // 拒绝
                        util.confirm.close();
                    },
                    onClose : function(){
                       
                    }
                });
            });
            $('.j-enable').on('click',function(){
                var userId = $(this).closest('tr').data('id');
                Util.confirm.open({
                    title: '解冻账户',
                    message: _p.getEnable(userId),
                    width: 300,
                    confirmTpl: '<span class="ui-button ui-button-mblue" id="j_bt_yes">确定</span>',
                    cancelTpl: '<span class="ui-button ui-button-mblue" id="j_bt_no">取消</span>',
                    onConfirm: function() { // 通过
                        _p.sb({
                            form : '#j_resetpwd',
                            submitButton : '#j_bt_yes'
                        })
                    },
                    onCancel:function(){    // 拒绝
                        util.confirm.close();
                    },
                    onClose : function(){
                       
                    }
                });
            });
            $('.j-remsg').on('click',function(){
                var jobname = $(this).closest('tr').find('td').eq(1).text();
                var username = $(this).closest('tr').find('td').eq(3).text();
                var userid = $(this).closest('tr').data('id');
                var selcon1 = $(this).data('deptname');
                var selcon2 = $(this).closest('tr').find('td').eq(2).text()
                 Util.confirm.open({
                    title: '修改',
                    message: _p.getChanHtml({
                        jobname: jobname,
                        username: username,
                        userid: userid,
                        selcon1: selcon1,
                        selcon2: selcon2
                    }),
                    confirmTpl: '<span class="ui-dialog-button-orange" id="j_bt_yes">确定</span>',
                    cancelTpl: '',
                    onConfirm: function() { // 通过
                        _p.sb({
                            form : '#j_create',
                            submitButton : '#j_bt_yes'
                        });                         
                    },
                    onCancel:function(){    // 拒绝
                        
                    },
                    onClose : function(){
                        try{util.delSelect(_o.dialogS1);}catch(e){}
                       
                       util.delSelect(_o.dialogS2);
                    }
                });
                _p.setDialogSlt();
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
    }
    var init = function(){
        _p.setSlt();
        _p.bind();
    }
    init();
    $$m.finish('ok');
});
