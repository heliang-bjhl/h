seajs.use("calendar_css"),seajs.use(["$","select","confirmbox","calendar","util"],function(a,b,c,d){var e={setCal:function(){var a=new d({trigger:"#jStartTime"}),b=new d({trigger:"#jEndTime"});a.on("selectDate",function(a){b.range([a,null])}),b.on("selectDate",function(b){a.range([null,b])})}},f=function(){e.setCal()};f(),$$m.finish("ok")});