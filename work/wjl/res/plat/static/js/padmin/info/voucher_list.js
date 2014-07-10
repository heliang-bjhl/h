// 下拉列表初始化 & 审核对话框 & 审核处理
seajs.use(["$", 'select', "confirmbox", "util"], function($, Select, ConfirmBox, util) {

    // 下拉列表，状态初始化
    new Select({
        trigger: '#qtype'
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
    
    var dialog = new ConfirmBox({
        trigger: '.J_review',
        title: '标题',
        message: html,
        confirmTpl: '<span class="ui-dialog-button-orange J_btnPass">通过</span>',
        cancelTpl: '<span class="ui-dialog-button-white J_btnRefuse">拒绝</span>',
        onConfirm: function() {	// 通过
        	onPassOrRefuse({
        		"result": 1
        		,"btn": ".J_btnPass"
        		,"applyId":$(this.activeTrigger).data("id")
        		,"dialog":this
        	});
        },
        onCancel:function(){	// 拒绝
        	onPassOrRefuse({
        		"result": 2
        		,"btn": ".J_btnRefuse"
        		,"applyId":$(this.activeTrigger).data("id")
        		,"dialog":this
        	});
        }
    });
    
    /** 审核处理
     *
	 *	@param {Object}	opts 	参数
	 *	@param {Number}	result 	审核结果[1:通过;2:拒绝]
	 *	@param {String}	applyId 处理的业务ID
	 *	@param {String}	btn 	触发按钮
	 *	@param {Object}	dialog  弹出层
     */
    function onPassOrRefuse(opts) {
		
		var opt = opts;
		var result = opt.result,
			applyId = opt.applyId,
			btn = opt.btn,
			dialog = opt.dialog;
		
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
                //util.alert(result == 2 ? (data.msg || "已经拒绝") : (data.msg || "已经通过"));
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
            "bReload": true,
			"submitButton": btn
        });

    }
});