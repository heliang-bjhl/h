// 下拉列表 & 文本字数限制 & radio按钮的操作
seajs.use("calendar_css");
seajs.use(["$", "select", "util","validator"], function($,Select, util, Validator) {
    new Select({
        trigger: '#jStyleSel'
    }).render();
    var validator = new Validator({
        element: '#j_form',
        onFormValidated: function(err, results, form) {
            //window.console && console.log && console.log(err, results, form);
            err != true && onSubmit();
        },
        autoSubmit: false,
        failSilently: true
    });
    function onSubmit(){
    	util.formSend("#j_form", {
	        "ajaxSuccess": function(data) {
	            
	            util.go({data:{url:'/t/pubmsg/list.j'}});
	        },
	        /*
	        "ajaxFail": function(data) {
	            data = data || {};
	            util.alert(result == 2 ? (data.msg || "拒绝失败") : (data.msg || "通过失败"));
	        },
	        */
	        "error": function() {
	        //util.alert("操作超时");
	        //dialog.hide();
	    	}
	    });
    }	 
    $$m.finish('ok');  
});

