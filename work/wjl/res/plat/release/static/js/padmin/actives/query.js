seajs.use(["$","select","confirmbox","util","autocomplete"],function(a,b,c,d,e){var f={},g={},h={setSel:function(){new b({trigger:"#j_onlinestyle"}).render()},setAc:function(){var b=new e({trigger:a("#querySubject"),dataSource:"/t/actives/query.aj?subject={{query}}",locator:function(b){b=b||{};var c=b.data||{},d=c.list||{},e=[];return a.each(d,function(a,b){e.push({value:b.activitySubject,id:b.activityId}),f[b.activityId]=b.activitySubject}),e},submitOnEnter:!1,filter:function(b,c){return""==a.trim(c)?[]:b}}).render();b.on("itemSelected",function(b){a("#querySubject").data("value",b.id),a("#activityId").val(b.id)});var c=new e({trigger:a("#queryOrganizer"),dataSource:"/t/actives/alist.aj?name={{query}}",locator:function(b){b=b||{};var c=b.data||{},d=c.list||{},e=[];return a.each(d,function(a,b){e.push({value:b.name,id:b.storeId}),g[b.storeId]=b.name}),e},submitOnEnter:!1,filter:function(b,c){return""==a.trim(c)?[]:b}}).render();c.on("itemSelected",function(b){a("#queryOrganizer").data("value",b.id)})}},i=function(){h.setSel(),h.setAc()};i(),$$m.finish("ok")});