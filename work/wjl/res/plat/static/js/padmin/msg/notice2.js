// 下拉列表 & 文本字数限制 & radio按钮的操作
seajs.use("calendar_css");
seajs.use(["$", "textLimit", "select","confirmbox", "util", "calendar"], function($, textLimit, Select,ConfirmBox, util, Calendar) {
    new Select({
        trigger: '#jStyleSel'
    }).render();
    var _p = {
    	getHtml : function(opt){
    		var html = [
    			'<div class="dialog-form">',
                    '<form action="" id="j_create">',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label class="ui-label">收件人: </label>',
                            '<span>人信汇全体会员</span>',
                        '</div>',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label class="ui-label">主题: </label>',
                            '<span>',opt.mailTitle,'</span>',
                        '</div>',
                        '<div class="ui-form-item dialog-form-item">',
                            '<label class="ui-label">内容: </label>',
                            '<span>',opt.maiCon,'</span>',
                        '</div>',
                    '</form>',
                '</div>'
    		].join('');
    		return html;
    	},
    	bind : function(){
    		$('.j-open-win').on('click',function(){
    			var mailti = $(this).closest('tr').find('td').eq(2).text();
    			var maicon = $(this).data('mailcon');
    			Util.confirm.open({
                    title: '公告消息详情',
                    message: _p.getHtml({
                    	mailTitle : mailti,
                    	maiCon : maicon
                    }),
                    confirmTpl: '',
                    cancelTpl: '',
                    onConfirm: function() {
                    },
                    onCancel:function(){
                    },
                    onClose : function(){
                       
                    }
                });
    		});
    	}
    };
    var init = function(){
    	_p.bind();
    }
    init();
    $$m.finish('ok');
});