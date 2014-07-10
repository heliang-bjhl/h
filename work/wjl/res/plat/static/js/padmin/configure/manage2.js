// 下拉列表 & 文本字数限制 & 添加帐号
seajs.use(["$",'select',"textLimit", "confirmbox", "insertText", "util"], function($, Select, textLimit, ConfirmBox, insertText, util) {
    $(function() {
        var html = [
                '<div class="dialog-form">',
                    '<form action="" id="frmDialog">',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label for="msg" class="ui-label">',
                            '主题:',
                            '</label>',
                            '<input class="ui-input" type="text" id="jAddVariables1" name="spec" placeholder="">',
                            '<select name="" id="insertBtn1" class="">',
                                '<option value="0">插入变量</option>',
                                '<option value="会员昵称">会员昵称</option>',
                                '<option value="手机号">手机号</option>',
                                '<option value="会员ID">会员ID</option>',
                            '</select>',
                            '<div class="ui-form-explain"></div>',
                        '</div>',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label for="msg" class="ui-label">',
                                '渠道:',
                            '</label>',
                            '<input type="radio" id="jInsideMall" /><label class="m-radio" for="jInsideMall">站内信</label>',
                            '<input type="radio" id="jSMS" /><label class="m-radio" for="jSMS">手机短信</label>',
                            '<div class="ui-form-explain"></div>',
                        '</div>',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label for="msg" class="ui-label">',
                                '内容:',
                            '</label>',
                            '<textarea class="ui-textarea" name="" id="jAddVariables2"></textarea>',
                            '<select name="" id="insertBtn2" class="ui-select-trigger">',
                                '<option value="0">插入变量</option>',
                                '<option value="会员昵称">会员昵称</option>',
                                '<option value="手机号">手机号</option>',
                                '<option value="会员ID">会员ID</option>',
                            '</select>',
                        '</div>',
                    '</form>',
                '</div>'
            ].join("");
        var dialog = new ConfirmBox({
            trigger: '#jAddNextTr',
            title: '标题',
            message: html,
            confirmTpl: '<span class="ui-dialog-button-orange J_btnPass">确定</span>',
            cancelTpl: '<span class="ui-dialog-button-white J_btnRefuse" style="display:none;">取消</span>',
            onConfirm: function() { // 通过
                onPassOrRefuse({
                    "result": 1,
                    "btn": ".J_btnPass",
                    "dialog":this
                });
            },
            onCancel:function(){    // 拒绝
                onPassOrRefuse({
                    "result": 2,
                    "btn": ".J_btnRefuse",
                    "dialog":this
                });

            }
        });
        //点击插入按钮
        $('#jAddNextTr').click(function(){
            if(!$(this).hasClass('testIfChange')){
                chengeSelectStyle();
                $(this).addClass('testIfChange');
            }
            var element = dialog.element    //得到dialog元素，通过此元素寻找子元素并绑定时间
            var insertBtn1 = element.find('#insertBtn1');
            var insertBtn2 = element.find('#insertBtn2');            
            $('body').find('.ui-select').css({
                'z-index' : 9999
            });
        });
        function chengeSelectStyle(){
            new Select({
                trigger: insertBtn1
            }).render().on('change',function(target){
                if(target.text() != '插入变量'){
                    var val = target.attr('data-value');
                    insertText($('#jAddVariables1')[0],val);
                }                
            });
            new Select({
                trigger: insertBtn2
            }).render().on('change',function(target){
                if(target.text() != '插入变量'){
                    var val = target.attr('data-value');
                    insertText($('#jAddVariables2')[0],val);
                }
            });
        }
        function onPassOrRefuse(opts) {
            var opt = opts;
            var result = opt.result,
                btn = opt.btn,
                dialog = opt.dialog;
            var element = dialog.element
            var sureBtn1 = element.find('.J_btnPass');
            sureBtn1.on('click',function(){
                dialog.hide();
            });
            //插入变量
        
            
            // 表单提交
            // util.formSend("#frmDialog", {
            //      "url": '/t/tickapply/audit.aj' ,
            //     "extraData": {
            //         "result": result,
            //         "applyId": applyId
            //     },
            //     "ajaxSuccess": function(data) {
            //         util.go();
            //     },
                
            //     "ajaxFail": function(data) {
            //         data = data || {};
            //         util.alert(result == 2 ? (data.msg || "拒绝失败") : (data.msg || "通过失败"));
            //     },
                
            //     "error": function() {
            //         //util.alert("操作超时");
            //         //dialog.hide();
            //     },
            //     "submitButton": btn
            // });

        }        
    });
});