seajs.use("calendar_css"),seajs.use(["$","select","confirmbox","validator","calendar","util"],function(a,b,c,d,e,f){var g={getCreateHtml:function(){var a=['<div class="dialog-form">','<form action="create.aj" id="j_create">','<div class="ui-form-item dialog-form-item">',"<label>角色名称: </label>",'<input class="ui-input ui-input-large j-role-nameinp" type="text" value="" name="roleName" />',"</div>",'<div class="ui-form-item dialog-form-item">',"<label>角色描述: </label>",'<input class="ui-input ui-input-large j-descriptioninp" type="text" value="" name="description" />',"</div>",'<div><input type="submit" style="display:none;" class="jSubMesg" /></div>',"</form>","</div>"].join("");return a},addVal:function(){var a=new d({element:"#j_create",onFormValidated:function(a){1!=a&&g.sb({form:"#j_create",submitButton:"#j_bt_yes"})},autoSubmit:!1,failSilently:!0});a.addItem({element:'input[name="roleName"]',required:!0,errormessageRequired:"请输入角色名称。"}).addItem({element:'input[name="description"]',required:!0,errormessageRequired:"请输入角色描述。"})},bind:function(){a("#jAddBank").on("click",function(){Util.confirm.open({title:"添加角色",message:g.getCreateHtml(),confirmTpl:'<span class="ui-dialog-button-orange" id="j_bt_yes">确定</span>',cancelTpl:"",onConfirm:function(){a("body").find("#j_create").trigger("submit")},onCancel:function(){},onClose:function(){}}),g.addVal()})},sb:function(a){f.formSend(a.form,{ajaxSuccess:function(a){f.go(a)},error:function(){f.alert("操作超时")},submitButton:a.submitButton})}},h=function(){g.bind()};h(),$$m.finish("ok")});