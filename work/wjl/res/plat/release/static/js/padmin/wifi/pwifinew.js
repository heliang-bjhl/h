seajs.use("calendar_css"),seajs.use(["$","util","calendar","confirmbox","uploadify","_","validator","select"],function(a,b,c,d,e,f,g,h){var i={setSel:function(){new h({trigger:"#j_upHour"}).render(),new h({trigger:"#j_upMinute"}).render(),new h({trigger:"#j_downHour"}).render(),new h({trigger:"#j_downMinute"}).render()},setCal:function(){var a=new c({trigger:"#j_upTime"}),b=new c({trigger:"#j_downTime"});a.on("selectDate",function(a){b.range([a,null])}),b.on("selectDate",function(b){a.range([null,b])})},setVal:function(){var a=new g({element:"#createFrm",onFormValidated:function(a){1!=a&&onSubmit()},autoSubmit:!1,failSilently:!0});a.addItem({element:"#j_msgName",required:!0,errormessageRequired:"请输入广告名称。"}).addItem({element:"#j_upTime",required:!0,errormessageRequired:"请输入上线时间。"}).addItem({element:"#j_downTime",required:!0,errormessageRequired:"请输入下线时间。"})},bind:function(){a("#j_default").on("click",function(){a(this).val("设为默认"==a(this).val()?"取消默认":"设为默认")})}},j=function(){i.setCal(),i.setSel(),i.setVal(),i.bind()};j(),b.bindUpload("#uploader-1",{imgSize:"500kb",max:1,min:1}),$$m.finish("ok")});