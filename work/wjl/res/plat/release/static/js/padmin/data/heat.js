seajs.use("calendar_css"),seajs.use(["$","util","calendar","select"],function(a,b,c,d){var e={setCal:function(){new c({trigger:"#j_searchTime1"})},setSel:function(){new d({trigger:"#j_forFloor"}).render()},sendAjax:function(){a.ajax({url:"/heat_map_detail_count",data:{floor:a("#j_forFloor").val(),day:a("#j_searchTime1").val().split("-").join("")},dataType:"json"}).done(function(b){if(200==b.code){var c=b.max;-1==c&&(c=0);var d=b.data||[];a("#heatmap").empty(),a("#heatmapbox>img").attr("src",b.pic),e.setHot({max:c,data:d})}else e.setHot({max:0,data:[]})}).fail(function(){})},setHot:function(b){var c={radius:30,element:"heatmap",visible:!0,opacity:30,offset:1e3,legend:{position:"left:100px;top:450px;",title:"客流热度"}},d=heatmapFactory.create(c);d.store.setDataSet({max:b.max,data:b.data}),a(".loading").hide(),a(".j_showhide").css({visibility:"visible"})},bind:function(){a("#j_forSearch").on("click",function(){a(".j_showhide").css({visibility:"hidden"}),a(".loading").show(),e.sendAjax()}),a("#j_forSearch").trigger("click")}},f=function(){e.setCal(),e.setSel(),e.bind()};f(),$$m.finish("ok")});