seajs.use(["$","confirmbox","util"],function(a,b,c){var d={getHtml:function(a){var b=['<div class="dialog-form">','<form action="usetick.aj" id="j_resetpwd">','<div class="ui-form-item dialog-form-item">',"确认对该优惠券进行核销？",'<input type="hidden" name="tickno" value="',a,'" />',"</div>","</form>","</div>"].join("");return b},bind:function(){a(".jifverifi").on("click",function(){var b=a(this).data("tickno"),e=d.getHtml(b);Util.confirm.open({title:"优惠券核销",message:e,confirmTpl:'<span class="ui-dialog-button-orange" id="j_bt_yes">确定</span>',cancelTpl:'<span class="ui-dialog-button-orange" id="j_bt_no">取消</span>',onConfirm:function(){d.sb({form:"#j_resetpwd",submitButton:"#j_bt_yes"}),a("body").find(".ui-poptip,.ui-poptip-white").css({zIndex:1100}),c.confirm.close()},onCancel:function(){c.confirm.close()},onClose:function(){}})})},sb:function(a){c.formSend(a.form,{ajaxSuccess:function(a){c.go(a)},error:function(){c.alert("操作超时")},submitButton:a.submitButton})}},e=function(){d.bind()};e(),$$m.finish("ok")});