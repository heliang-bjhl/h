seajs.use("calendar_css"),seajs.use(["$","select","calendar","confirmbox","util"],function(a,b,c,d,e){function f(a){var b=['<div class="dialog-form">','<form action="obsolete.j" id="j_fall">',"<p>是否确认</p>",'<input type="hidden" value="',a,'" name="tickId" />',"</form>","</div>"].join("");return b}function g(a,b){e.formSend("#frmDialog",{url:($$c.domain||"http://"+location.host)+"/t/tickapply/audit.aj",extraData:{result:a,applyId:b},ajaxSuccess:function(b){b=b||{},e.alert(2==a?b.msg||"已经拒绝":b.msg||"已经通过")},error:function(){e.alert("操作超时")},bReload:!0})}var h={setCal:function(){var b=new c({trigger:"[name=createTimeStart]"}),d=new c({trigger:"[name=createTimeEnd]"});if(b.on("selectDate",function(a){d.range([a,null])}),d.on("selectDate",function(a){b.range([null,a])}),a("[name=pullStart]").length>0&&a("[name=pullEnd]").length>0){var e=new c({trigger:"[name=pullStart]"}),f=new c({trigger:"[name=pullEnd]"});e.on("selectDate",function(a){f.range([a,null])}),f.on("selectDate",function(a){e.range([null,a])})}}},i=function(){h.setCal()};i(),new b({trigger:"#qtype"}).render(),new b({trigger:"#qstate"}).render();{var j=['<div class="dialog-form">        <form action="" id="frmDialog">        <div class="ui-form-item dialog-form-item">            <label for="msg" class="ui-label">                描述            </label>            <textarea class="ui-textarea" name="msg" id="msg"></textarea>            <div class="ui-form-explain"></div>        </div>        </form>        </div>'].join("");new d({trigger:".J_review",title:"标题",message:j,confirmTpl:'<span class="ui-dialog-button-orange">通过</span>',cancelTpl:'<span class="ui-dialog-button-white">拒绝</span>',onConfirm:function(){g(2,a(this.activeTrigger).data("id"),this),this.hide()},onCancel:function(){g(1,a(this.activeTrigger).data("id"),this),this.hide()}})}a(".j-cancel-btn").on("click",function(){var b=a(this).data("tickid");Util.confirm.open({title:"确认作废",message:f(b),confirmTpl:'<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_yes">确定</span>',cancelTpl:'<span class="ui-dialog-button-orange ui-dialog-button-orange2" id="j_bt_no">取消</span>',width:300,onConfirm:function(){sb({form:"#j_fall",submitButton:"#j_bt_yes"})},onCancel:function(){e.confirm.close()},onClose:function(){}})}),sb=function(a){e.formSend(a.form,{ajaxSuccess:function(a){e.go(a)},error:function(){e.alert("操作超时")},submitButton:a.submitButton})},$$m.finish("ok")});