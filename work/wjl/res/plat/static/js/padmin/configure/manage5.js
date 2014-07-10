// 下拉列表 & 文本字数限制 & 添加帐号
seajs.use(["$",'select',"textLimit", "confirmbox", "util"], function($, Select, textLimit, ConfirmBox, util) {
    $(function() {
        
        // 绑定删除事件
        $("#tblList").on('click','.j-delete-tr',function() {
            if (window.confirm("确认删除")) {
                $(this).closest("tr").remove();
            }
        });
        // 添加帐号列表
        var insertTable = {
            itemHtml : [
                '<tr class="ui-table-split">',
                    '<td>{htmls}</td>',
                    '<td class="hand">',
                        '<input type="button" class="ui-button ui-button-mwhite j-change-mes" value="编辑">',
                        '<input type="button" class="ui-button ui-button-mwhite j-delete-tr" value="删除">',
                    '</td>',
                '</tr>'
            ].join(''),
            bind : function(opt){
                var triggerSelector = opt.triggerSelector;
                var _this = this;
                $(triggerSelector).on('click',function(){
                    var tryCan = _this._canInsert(opt);
                    if(tryCan != 1){
                        return alert(tryCan);
                    }else{
                        _this.insert(opt);
                    }          
                });
            },
            _canInsert : function(opt){
                var isOk = 1;
                var tBody = opt.tBody;
                var contextSelector = opt.contextSelector;
                var context = $(contextSelector).val();
                if(!context){return isOk = '内容不能为空！';}
                if($(tBody).find('tr').length > 0){
                    $(tBody).find('tr').each(function(){
                        var reContext = $(this).find("td").eq(0).text();
                        if(reContext == context){
                            isOk = '类型不能重复！';
                        }
                    });
                }
                return isOk;
            },
            send : function(){
                return true;
            },
            insert : function(opt){
                var context = $(opt.contextSelector).val();
                var tBody = opt.tBody;
                var appendContent = this.itemHtml.replace(/{(\w*)}/g,function(){
                    return context;
                });
                $(tBody).append(appendContent);
            }
        };
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
            $(content).on('click',".J_btnPass",function(){
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