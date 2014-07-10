// $$m.length = 1;
seajs.use(["$",'select', 'util'], function($,Select, util) {
    var _p = {
        setSel : function(){
            if($('#j_storeStyle').length > 0){
                new Select({
                    trigger: '#j_storeStyle'
                }).render();
            }
            if($('#j_Floor').length > 0){
                new Select({
                    trigger: '#j_Floor'
                }).render();
            }
        }
    };
    var init = function(){
        _p.setSel();
    };
    init();
    $$m.finish('ok');
});
/*
seajs.use(["$","select"], function($,select){
	var selects = select({
		"select":".ui-select"
		,"option":".ui-select-content"
        ,"item":"a"
        ,"icon":".iconfont"
        ,"callback":function(){
            $(this).parents(".ui-select").first().find(".ui-select-trigger").html($(this).html() + '<i class="iconfont" title="下三角形">&#xF03C;</i>');
            $(this).parents("li").first().siblings().removeClass("ui-select-item-disabled");
            $(this).parents("li").addClass("ui-select-item-disabled");
        }
	})[0].show()[0].hide();
    if(selects.length > 0){
        selects[0].show()[0].hide();
    }
	
});
*/