$$m.length=4,seajs.use("calendar_css"),seajs.use(["$","textLimit","select","util","calendar"],function(a,b,c,d,e){var f={},g={setSlt:function(){f.useStartTime_m=new c({trigger:"#useStartTime-m"}).render(),f.useStartTime_s=new c({trigger:"#useStartTime-s"}).render(),f.useEndTime_m=new c({trigger:"#useEndTime-m"}).render(),f.useEndTime_s=new c({trigger:"#useEndTime-s"}).render(),f.selectElement=new c({trigger:"#sltStatus"}).render(),f.sltStartHour=new c({trigger:"#sltStartHour"}).render(),f.sltStartMinute=new c({trigger:"#sltStartMinute"}).render(),f.sltEndHour=new c({trigger:"#sltEndHour"}).render(),f.sltEndMinute=new c({trigger:"#sltEndMinute"}).render(),f.sltSaleTimeHour=new c({trigger:"#onsaleTimeHour"}).render(),f.sltSaleTimeMinute=new c({trigger:"#onsaleTimeMinute"}).render(),f.sltSaleEndtimeHour=new c({trigger:"#onsaleEndtimeHour"}).render(),f.sltEndSaleEndtimeMinute=new c({trigger:"#onsaleEndtimeMinute"}).render()},setCal:function(){var a=new e({trigger:"#txtBeginDate"}),b=new e({trigger:"#txtEndDate"}),c=new e({trigger:"#onsaleTime"}),d=new e({trigger:"#pullStart"}),f=new e({trigger:"#pullEnd"}),g=new e({trigger:"#onsaleEndtime"});a.on("selectDate",function(a){b.range([a,null]),d.range([null,a])}),b.on("selectDate",function(b){a.range([null,b]),f.range([null,b])}),c.on("selectDate",function(a){d.range([a,null])}),d.on("selectDate",function(b){f.range([b,null]),a.range([b,null])}),f.on("selectDate",function(a){g.range([a,null]),b.range([a,null])}),d.on("selectDate",function(a){c.range([null,a])}),f.on("selectDate",function(a){d.range([null,a])}),g.on("selectDate",function(a){f.range([null,a])}),c.on("selectDate",function(b){a.range([b,null])}),a.on("selectDate",function(a){c.range([null,a])})},setChangeRadio:function(){var a=[{name:"dayNo",input:'input[name="dayNoValue"]',index:1},{name:"dayUserNo",input:'input[name="dayUserNoValue"]',index:1},{name:"userNo",input:'input[name="userNoValue"]',index:1}];d.changeRadio(a),new d.ChangeRadio({radioName:"facePriceType"}),new d.ChangeRadio({radioName:"quantity"}),new d.ChangeRadio({radioName:"dayNo"}),new d.ChangeRadio({radioName:"dayUserNo"}),new d.ChangeRadio({radioName:"userNo"}),new d.ChangeRadio({radioName:"useAreatype",selects:{j_useAreatype_2_k:[f.selectElement]}})},setTextarea:function(){b({input:"#txtDescription",tip:"#lblDescriptionMsg",msg:function(a){var b=a||{};return b.max-b.count<0?"输入已经超过了可允许的{max}字数":"还能输入{rest}个字"},max:1500,min:0,enableBr:!0,changeFn:function(){}}).init()}},h=function(){g.setSlt(),g.setCal(),g.setChangeRadio(),g.setTextarea()};h(),d.limitnum({parentClass:".j-for-float-num"}),d.limitnum({parentClass:".j-for-int-num",mold:"int"}),$$m.itemok("ok")}),seajs.use(["$","uploadify","util","_"],function(a,b,c){a(function(){c.bindUpload("#uploader-1",{imgSize:"500kb"})}),$$m.itemok("ok")});var useArr={};seajs.use(["$","autocomplete"],function(a,b){var c=new b({trigger:a('[name="useArea"]'),dataSource:"/t/store/alist.aj?name={{query}}&t={{timestamp}}",locator:function(b){b=b||{};var c=b.data||{},d=c.list||{},e=[];return a.each(d,function(a,b){e.push({value:b.name,id:b.storeId}),useArr[b.storeId]=b.name}),e},submitOnEnter:!1,filter:function(b,c){return""==a.trim(c)?[]:b}}).render();c.on("itemSelected",function(b){a("#j_useArea").data("value",b.id)}),a("#j_useAreatype_3_k input").on("blur",function(){useArr[a(this).data("value")]==a(this).val()||(a(this).val(""),a(this).data("value",""))}),$$m.itemok("ok")}),seajs.use(["validator","$","util"],function(a,b,c){b(function(){function d(){var a=c.timeToString({hour:"#useStartTime-m",minute:"#useStartTime-s"}),d=c.timeToString({hour:"#useEndTime-m",minute:"#useEndTime-s"}),f=c.timeToString({date:"#pullStart",hour:"#sltStartHour",minute:"#sltStartMinute",type:"date"}),g=c.timeToString({date:"#pullEnd",hour:"#sltEndHour",minute:"#sltEndMinute",type:"date"}),f=c.timeToString({date:"#pullStart",hour:"#sltStartHour",minute:"#sltStartMinute",type:"date"}),h=c.timeToString({date:"#onsaleTime",hour:"#onsaleTimeHour",minute:"#onsaleTimeMinute",type:"date"}),i=c.timeToString({date:"#onsaleEndtime",hour:"#onsaleEndtimeHour",minute:"#onsaleEndtimeMinute",type:"date"}),j=b("#uploadImg1 .loaded-img").first().attr("data-src"),k=b('[name="useAreatype"]:checked').val(),l=null;l=0==k?"":1==k?b("#sltStatus").val():b('[name="useArea"]').val();var m={pic:j,useStartTime:a,useEndTime:d,onsaleTime:h,onsaleEndtime:i,pullEnd:g,pullStart:f};c.formSend("#"+e,{extraData:m,ajaxSuccess:function(a){c.go(a)},error:function(){c.alert("操作超时")},submitButton:"#btnSave"})}var e="frmCreate2";b("#frmStoreCreate").attr("id",e);var f=new a({element:"#"+e,onFormValidated:function(a){1!=a&&d()},autoSubmit:!1,failSilently:!0});f.addItem({element:'input[name="title"]',required:!0,errormessageRequired:"请输入优惠券名称。"}).addItem({element:"#txtBeginDate",required:!0,errormessageRequired:"请输入 券有效期的开始时间。"}).addItem({element:"#txtEndDate",required:!0,errormessageRequired:"请输入 券有效期的截止时间。"}).addItem({element:'input[name="useArea"]',required:!0,errormessageRequired:"请输入指定店铺。"}).addItem({element:"#sltStatus",required:!0,errormessageRequired:"请输入指定业态 。"}).addItem({element:"#onsaleTime",required:!0,errormessageRequired:"请输入上架日期。"}).addItem({element:"#onsaleEndtime",required:!0,errormessageRequired:"请输入下架时间。"}).addItem({element:"#pullStart",required:!0,errormessageRequired:"请输入领取开始时间。"}).addItem({element:"#pullEnd",required:!0,errormessageRequired:"请输入领取结束时间。"}).addItem({element:'textarea[name="remark"]',required:!0,errormessageRequired:"请输入详细描述。"}).addItem({element:"[name=facePriceType]",required:!0,errormessageRequired:"请选择面额大小。"}).addItem({element:'[name="quantity"]',required:!0,errormessageRequired:"请选择发行数量。"}).addItem({element:'[name="dayNo"]',required:!0,errormessageRequired:"请选择渠道每日领取量。"}).addItem({element:'[name="dayUserNo"]',required:!0,errormessageRequired:"请选择用户每日领取量。"}).addItem({element:'[name="userNo"]',required:!0,errormessageRequired:"请选择用户最大领取量。"}),b("[name=facePriceType]").change(function(){var a=b(this).attr("value");f.removeItem("#facePrice"),"0"==a?(b("#facePrice").attr("data-explain","请输入面额大小"),f.addItem({element:"#facePrice",required:!0,rule:"",errormessageRequired:"请输入面额大小"})):f.removeItem("#facePrice")}),b("[name=quantity]").change(function(){var a=b(this).attr("value");f.removeItem("#limitQuantity"),"1"==a?(b("#limitQuantity").attr("name","limitQuantity"),b("#limitQuantity").attr("data-explain","请输入发行数量"),f.addItem({element:"#limitQuantity",required:!0,rule:"",errormessageRequired:"请输入发行数量"})):(f.removeItem("#limitQuantity"),b("#limitQuantity").attr("name",""))}),b("[name=dayNo]").change(function(){var a=b(this).attr("value");f.removeItem('[name="dayNoValue"]'),"0"==a?(b('[name="dayNoValue"]').attr("data-explain","请输入渠道每日领取量"),f.addItem({element:'[name="dayNoValue"]',required:!0,rule:"",errormessageRequired:"请输入渠道每日领取量"})):f.removeItem('[name="dayNoValue"]')}),b("[name=dayUserNo]").change(function(){var a=b(this).attr("value");f.removeItem('[name="dayUserNoValue"]'),"0"==a?(b('[name="dayUserNoValue"]').attr("data-explain","请输入用户每日领取量"),f.addItem({element:'[name="dayUserNoValue"]',required:!0,rule:"",errormessageRequired:"请输入用户每日领取量"})):f.removeItem('[name="dayUserNoValue"]')}),b("[name=dayNo]").change(function(){var a=b(this).attr("value");f.removeItem('[name="userNoValue"]'),"0"==a?(b('[name="userNoValue"]').attr("data-explain","请输入用户最大领取量"),f.addItem({element:'[name="userNoValue"]',required:!0,rule:"",errormessageRequired:"请输入用户最大领取量"})):f.removeItem('[name="userNoValue"]')}),"0"==b('[name="facePriceType"]:checked').val()&&b("[name=facePriceType]").trigger("change"),"1"==b('[name="quantity"]:checked').val()&&b("[name=quantity]").trigger("change"),"0"==b('[name="dayNo"]:checked').val()&&b("[name=dayNo]").trigger("change"),"0"==b('[name="dayUserNo"]:checked').val()&&b("[name=dayUserNo]").trigger("change"),"0"==b('[name="dayNo"]:checked').val()&&b("[name=dayNo]").trigger("change")}),$$m.itemok("ok")});