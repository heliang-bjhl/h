seajs.use(["$","select","textLimit","confirmbox","util"],function(a,b,c,d){a(function(){function b(){var a=f.element;f.hide(),a.find("#msg").val("")}function c(b){{var c=b.clickbtn,d=b.dialog,e=d.element;c.closest("tr").find("td").eq(0)}a(e).on("click",".J_btnPass",function(){d.hide()})}a("#tblList").on("click",".j-delete-tr",function(){window.confirm("确认删除")&&a(this).closest("tr").remove()}),insertTable.bind({triggerSelector:"#jAddNextTr",tBody:"#tblList tbody",contextSelector:"#jAddNextTrVal"});var e=['<div class="dialog-form">            <form action="" id="frmDialog">            <div class="ui-form-item dialog-form-item">                <label for="msg" class="ui-label">                    描述                </label>                <textarea class="ui-textarea" name="msg" id="msg"></textarea>                <div class="ui-form-explain"></div>            </div>            </form>            </div>'].join(""),f=new d({title:"修改类型名称",message:e,confirmTpl:'<span class="ui-dialog-button-orange J_btnPass">修改</span>',cancelTpl:'<span class="ui-dialog-button-white J_btnRefuse">取消</span>',onCancel:function(){b({btn:".J_btnRefuse",dialog:this})}});a("#tblList").on("click",".j-change-mes",function(){f.show();var b=a(this);f.onConfirm=function(){c({btn:".J_btnPass",dialog:this,clickbtn:b})},f.onConfirm()})})});