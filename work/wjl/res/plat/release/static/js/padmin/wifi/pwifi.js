seajs.use("calendar_css"),seajs.use(["$","util","calendar","select","confirmbox"],function(a,b,c,d){var e={},f={setSel:function(){e.mounth1=new d({trigger:"#j_selChannel"}).render(),e.mounth2=new d({trigger:"#j_selState"}).render()},getUpHtml:function(a){var b=['<div class="dialog-form">','<form action="" id="j_createUpFrm">',"<p>是否确认置顶？</p>",'<input type="hidden" value="',a,'" name="" />',"</form>","</div>"].join("");return b},getUnderHtml:function(a){var b=['<div class="dialog-form">','<form action="" id="j_createUnderFrm">',"<p>是否确认下线？</p>",'<input type="hidden" value="',a,'" name="" />',"</form>","</div>"].join("");return b},bind:function(){a(".j_setUp").on("click",function(){var c=a(this).closest("tr").data("id");Util.confirm.open({title:"确认置顶",message:f.getUpHtml(c),confirmTpl:'<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_yes">确定</span>',cancelTpl:'<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_no">取消</span>',width:300,onConfirm:function(){sb({form:"#j_createUpFrm",submitButton:"#j_bt_yes"})},onCancel:function(){b.confirm.close()},onClose:function(){}})}),a(".j_setUnder").on("click",function(){var c=a(this).closest("tr").data("id");Util.confirm.open({title:"确认下线",message:f.getUnderHtml(c),confirmTpl:'<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_Unyes">确定</span>',cancelTpl:'<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_Unno">取消</span>',width:300,onConfirm:function(){sb({form:"#j_createUnderFrm",submitButton:"#j_bt_Unyes"})},onCancel:function(){b.confirm.close()},onClose:function(){}})})}},g=function(){f.setSel(),f.bind()};g(),$$m.finish("ok")});