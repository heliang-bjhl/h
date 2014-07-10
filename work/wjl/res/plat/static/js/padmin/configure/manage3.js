// 下拉列表 & 文本字数限制 & 添加帐号
seajs.use(["$",'select',"textLimit", "confirmbox", "util"], function($, Select, textLimit, ConfirmBox, util) {
    $(function() {
        
        // 绑定删除事件
        $("#tblList").on('click','.j-delete-tr',function() {
            if (window.confirm("确认删除")) {
                $(this).closest("tr").remove();
            }
        });
        
        insertTable.bind({
            triggerSelector : '#jAddNextTr',
            tBody : '#tblList tbody',
            contextSelector : '#jAddNextTrVal'
        });
        //dialog显示内容
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
        //编辑修改
        var dialog = new ConfirmBox({            
            title: '修改类型名称',
            message: html,
            confirmTpl: '<span class="ui-dialog-button-orange J_btnPass">修改</span>',
            cancelTpl: '<span class="ui-dialog-button-white J_btnRefuse">取消</span>',
            onCancel:function(){    // 拒绝
                onPassCancel({
                    "btn": ".J_btnRefuse"
                    ,"dialog":this
                });
            }
        });
        //编辑类型
        $('#tblList').on('click','.j-change-mes',function(){
            dialog.show();
            var $this = $(this);
            dialog.onConfirm = function() { // 通过
                onPass({
                    btn:".J_btnPass",
                    dialog : this,
                    clickbtn : $this
                });
            }
            dialog.onConfirm();
        });
        function onPassCancel(opts){
            var content = dialog.element;
            dialog.hide();
            content.find('#msg').val('');
        }
        function onPass(opts) {
            var clickbtn = opts.clickbtn;
            var dialog = opts.dialog;
            var content = dialog.element;
            var faNodeText = clickbtn.closest('tr').find('td').eq(0);
            $(content).on('click',".J_btnPass",function(){//此处提交表单，重新加载页面
                dialog.hide();
            });               
                
            // 表单提交
            // util.formSend("#frmDialog", {
            //     // "url": ($$c.domain || "http://" + location.host) + '/t/tickapply/audit.aj' // --- debug --- 测试用
            //     // ,
            //     "extraData": {
            //         "result": result,
            //         "applyId": applyId
            //     },
            //     "ajaxSuccess": function(data) {
            //         data = data || {};
            //         //util.alert(result == 2 ? (data.msg || "已经拒绝") : (data.msg || "已经通过"));
            //         //dialog.hide();
            //     },
            //     /*
            //     "ajaxFail": function(data) {
            //         data = data || {};
            //         util.alert(result == 2 ? (data.msg || "拒绝失败") : (data.msg || "通过失败"));
            //     },
            //     */
            //     "error": function() {
            //         //util.alert("操作超时");
            //         //dialog.hide();
            //     },
            //     "submitButton": btn
            // });

        }
    });
});