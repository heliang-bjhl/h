// 表单验证 & 表单提交
seajs.use(['$','validator', "util"], function($, Validator, util) {
    
    // 表单验证
    var validator = new Validator({
        element: '#frmStorePassword',
        onFormValidated : function(err, results, form) {
            //window.console && console.log && console.log(err, results, form);
            err != true && onSubmit();
        },
        autoSubmit:false,
        failSilently: true
    });
    
    // 验证各项目
    validator
        .addItem({
            element: '#txtPassword',
            required: true,
            errormessageRequired: '请输入旧密码。'
        })
        .addItem({
            element: '#txtNewPassword',
            required: true,
            errormessageRequired: '请输入新密码。'
        })
        .addItem({
            element: '#txtNewConfirmPassword',
            required: true,
            errormessageRequired: '请再次输入新密码。'
        })
        
    function onSubmit() {
        if($.trim($("#txtNewPassword").val()) != $.trim($("#txtNewConfirmPassword").val())){
        	util.alert("两次输入的新密码不一致");
        }
        util.formSend("#frmStorePassword", {
            "ajaxSuccess": function(data) {
                data = data || {};
                util.alert(data.msg || "提交成功");
            },
            "error": function() {
                util.alert("操作超时")
            },
            "submitButton":"#btnSave"
        });
    };
});