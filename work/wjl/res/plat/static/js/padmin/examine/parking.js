// 下拉列表初始化 & 审核对话框 & 审核处理
seajs.use(["$", 'select', "confirmbox", "util"], function($, Select, ConfirmBox, util) {


    var html = [
        '<div class="dialog-form">\
        <form action="" id="frmDialog">\
        </form>\
        </div>'
    ].join("");
    $('.J_review').on('click', function() {
        var me = $(this);
        Util.confirm.open({
            
            title: '是否确认审核？',
            message: html,
            confirmTpl: '<span class="ui-dialog-button-orange J_btnPass">通过</span>',
            cancelTpl: '<span class="ui-dialog-button-white J_btnRefuse">拒绝</span>',
            width: 300,
            onConfirm: function() { // 通过
                onPassOrRefuse({
                    "result": 1,
                    "btn": ".J_btnPass",
                    "applyId": me.data("id"),
                    "dialog": this
                });
            },
            onCancel: function() { // 拒绝
                onPassOrRefuse({
                    "result": 2,
                    "btn": ".J_btnRefuse",
                    "applyId": me.data("id"),
                    "dialog": this
                });

            },
            onClose : function(){
               
            }
        });
    })


    /** 审核处理
     *
     *  @param {Object} opts    参数
     *  @param {Number} result  审核结果[1:通过;2:拒绝]
     *  @param {String} applyId 处理的业务ID
     *  @param {String} btn     触发按钮
     *  @param {Object} dialog  弹出层
     */

    function onPassOrRefuse(opts) {

        var opt = opts;
        var result = opt.result,
            applyId = opt.applyId,
            btn = opt.btn,
            dialog = opt.dialog;

        // 表单提交
        util.formSend("#frmDialog", {
            "url": '/t/parkingapply/audit.j' // --- debug --- 测试用
            ,
            successTxt : '审核成功!',
            "extraData": {
                "result": result,
                "tickId": applyId
            },
            "ajaxSuccess": function(data) {
                util.go({
                    data: {
                        url: '/t/parkingapply/auditlist.j'
                    }
                })
            },
            /*
            "ajaxFail": function(data) {
                data = data || {};
                util.alert(result == 2 ? (data.msg || "拒绝失败") : (data.msg || "通过失败"));
            },
            */
            "error": function() {
                //util.alert("操作超时");
                //dialog.hide();
            },
            "submitButton": btn
        });

    }
    $$m.finish('ok');
});
