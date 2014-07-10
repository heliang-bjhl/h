// 下拉列表初始化 & 审核对话框 & 审核处理
seajs.use(["$", 'select', "confirmbox", "util"], function($, Select, ConfirmBox, util) {

    // 下拉列表，状态初始化
    new Select({
        trigger: '#qtype'
    }).render();
    new Select({
        trigger: '#qrange'
    }).render(); 
    new Select({
        trigger: '#qstate'
    }).render();

    var html = [
        '<div class="dialog-form">\
        <form action="" id="frmDialog">\
        <div class="ui-form-item dialog-form-item">\
            <label for="msg" class="ui-label">\
                描述\
            </label>\
            <textarea class="ui-textarea" name="msg" id="msg"></textarea>\
            <div class="ui-form-explain"></div>\
        </div>\
        </form>\
        </div>'
    ].join("");
    function returnhtml(dataid){
        var cantelHtml = [
            '<div class="dialog-form">',
                '<form action="obsolete.j" id="j_fail">',
                    '<div class="ui-form-item dialog-form-item">',
                        '是否确定作废？',
                    '</div>',
                    '<input type="hidden" name="tickId" value="',dataid,'" />',
                '</form>',
            '</div>'
            ].join('');
        return cantelHtml;
    }        
    
    var dialog = new ConfirmBox({
        trigger: '.J_review',
        title: '标题',
        message: html,
        confirmTpl: '<span class="ui-dialog-button-orange">通过</span>',
        cancelTpl: '<span class="ui-dialog-button-white">拒绝</span>',
        onConfirm: function() { // 通过
            onPassOrRefuse(2, $(this.activeTrigger).data("id"), this);
            this.hide();
        },
        onCancel:function(){    // 拒绝
            onPassOrRefuse(1,  $(this.activeTrigger).data("id"), this);
            this.hide();
        }
    });
    $('.j-cancel-btn').on('click',function(){
        var dataid = $(this).data('tickid');
        Util.confirm.open({
            title: '作废',
            message: returnhtml(dataid),
            confirmTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_yes">确定</span>',
            cancelTpl: '<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_no">取消</span>',
            width : 300,
            onConfirm: function() { // 通过
                sb({
                    form: '#j_fail',
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
    
    /** 审核处理
     *
     *  @param {Number} result  审核结果[1:通过;2:拒绝]
     *  @param {String} applyId 处理的业务ID
     *  @param {Object} dialog  弹出层
     */
    function onPassOrRefuse(result, applyId, dialog) {

        // 表单提交
        util.formSend("#frmDialog", {
            "url": ($$c.domain || "http://" + location.host) + '/t/tickapply/audit.aj' // --- debug --- 测试用
            ,
            "extraData": {
                "result": result,
                "applyId": applyId
            },
            "ajaxSuccess": function(data) {
                data = data || {};
                util.alert(result == 2 ? (data.msg || "已经拒绝") : (data.msg || "已经通过"));
                //dialog.hide();
            },
            /*
            "ajaxFail": function(data) {
                data = data || {};
                util.alert(result == 2 ? (data.msg || "拒绝失败") : (data.msg || "通过失败"));
            },
            */
            "error": function() {
                util.alert("操作超时");
                //dialog.hide();
            },
            "bReload": true
        });

    }
    sb = function(op) {
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
    $$m.finish('ok');
});