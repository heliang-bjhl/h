// 下拉列表 & 文本字数限制 & 添加帐号
seajs.use(["$", 'select', "validator", "confirmbox", "util"], function($, Select, Validator, ConfirmBox, util) {
    $(function() {
        var getHtml = function() {
            var html = [
                '<div class="dialog-form">',
                '<form action="" id="j_form">',
                '<fieldset>',
                '<div id="j_addid"></div>',
                '<div class="ui-form-item">',
                '<label for="" class="ui-label">',
                '<span class="ui-form-required">*</span>',
                '名称',
                '</label>',
                '<input class="ui-input" type="text"  name="dicName" id="j_dicName" placeholder="名称" value="">',

                '</div>',
                '<div class="ui-form-item">',
                '<label for="" class="ui-label">',
                '<span class="ui-form-required">*</span>',
                '代码',
                '</label>',
                '<input class="ui-input" type="text"  name="dicCode" id="j_dicCode" placeholder="代码" value="">',
                '</div>',
                '</fieldset>',
                '</form> ',
                '</div>'
            ].join("");
            return html;
        }

        //dialog显示内容
        var _o = {
            dialog: function() {
                util.confirm.open({
                    title: '填写类型名称',
                    message: getHtml(),
                    confirmTpl: '<span class="ui-dialog-button-orange J_btnPass" id="J_btnPass">修改</span>',
                    cancelTpl: '<span class="ui-dialog-button-white J_btnRefuse">取消</span>',
                    onCancel: function() { // 拒绝
                        util.confirm.close(); 
                    },
                    onConfirm: function() {
                        _o.send();
                    }
                })
            },
            dialog2: function() {
                util.confirm.open({
                    title: '是否删除',
                    message: '<form action="" id="j_form2"><input id="j_form2_v" type="hidden" name="id"/></form>',
                    confirmTpl: '<span class="ui-dialog-button-orange J_btnPass" id="J_btnPass2">删除</span>',
                    cancelTpl: '<span class="ui-dialog-button-white J_btnRefuse">取消</span>',
                    onCancel: function() { // 拒绝
                        util.confirm.close(); 
                    },
                    onConfirm: function() {
                        _o.send2();
                    }
                })
            },
            url: '',
            url2: '',

            set: function(op) {
                $('#j_dicName').val(op.name);
                $('#j_dicCode').val(op.code);
                if (op.id) { //修改
                    $('#j_addid').html('<input  type="hidden" name="id" value="' + op.id + '"/>');
                    $('#J_btnPass').html('修改');
                } else {
                    $('#j_addid').html();
                    $('#J_btnPass').html('添加');
                }
            },
            showDialog: function(op) {

                var htmls = getHtml(op);

                _o.dialog();
                _o.set(op);


            },
            send: function() {
                util.formSend("#j_form", {

                    "url": _o.url,
                    "ajaxSuccess": function(data) {
                        util.go(data)
                        //util.go({data:{url:'/t/pubmsg/list.j'}});
                    },
                    /*
                "ajaxFail": function(data) {
                    data = data || {};
                    util.alert(result == 2 ? (data.msg || "拒绝失败") : (data.msg || "通过失败"));
                },
                */
                    "error": function() {
                        //util.alert("操作超时");
                    },
                    submitButton: '#J_btnPass'
                });
            },
            send2: function() {
                util.formSend("#j_form2", {

                    "url": _o.url2,
                    "ajaxSuccess": function(data) {
                        util.go(data)
                        //util.go({data:{url:'/t/pubmsg/list.j'}});
                    },
                    /*
                "ajaxFail": function(data) {
                    data = data || {};
                    util.alert(result == 2 ? (data.msg || "拒绝失败") : (data.msg || "通过失败"));
                },
                */
                    "error": function() {
                        //util.alert("操作超时");
                    },
                    submitButton: '#J_btnPass2'
                });
            },
            bind: function() {
                // 删除
                $("#tblList").on('click', '.j-delete-tr', function() {
                    _o.url2 = $(this).data('type') + '_' + $('#j_type').val() + '.aj';
                    _o.dialog2();
                    $('#j_form2_v').val($(this).data('id'))
                });
                //编辑
                $('#tblList').on('click', '.j-change-mes', function() {
                    _o.showDialog({
                        name: $(this).closest('tr').find('td:eq(0)').text(),
                        code: $(this).closest('tr').find('td:eq(1)').text(),
                        id: $(this).data('id')
                    });
                    _o.url = $(this).data('type') + '_' + $('#j_type').val() + '.aj'

                });
                //add
                $('#j_add').on('click', function() {
                    _o.url = $(this).data('type') + '_' + $('#j_type').val() + '.aj'
                    _o.showDialog({
                        name: '',
                        code: ''
                    });

                });

            }
        }








        _o.bind();

    });
    $$m.finish('ok');
});
