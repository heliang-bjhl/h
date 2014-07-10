// 下拉列表 & 文本字数限制 & 添加帐号
seajs.use(["$"], function($) {
    $('#save').on('click',function(){
        var qtype = $("input[type=radio][name=activityType]:checked").val();
        location.href =  qtype;
    })
    $$m.finish('ok');
});