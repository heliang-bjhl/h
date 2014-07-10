define('custom/select/select-debug', [], function(require, exports, module) {
    var $ = require("jquery");
    var doc = document;
    var stopPropagation = function(a) {
    	$(document).trigger("DOMClick");
    	if (a == null && window.event) {
    		return false
    	}
    	if (window.event) {
    		window.event.cancelBubble = true
    	} else {
    		a.stopPropagation()
    	}
    };
    
    /** 实现HTMLSelect的功能
     *
	 *  @author	ywchen(陈余文)
	 *  @date	2014.03.03
     *
     *  @param {object}         opts            参数
     *         {HTMLElement}    opts.select     选择框dom
     *         {HTMLElement}    opts.option     选择框下拉列表dom
     *         {HTMLElement}    opts.item       选择框下拉列表中的项目dom
     *         {Function}       opts.callback   选中项目时的回调
     *  @eg.
            seajs.use(["$","select"], function($,select){
            	var selects = select({
            		"select":".ui-select"
            		,"option":".ui-select-content"
                    ,"item":"a"
                    ,"icon":".iconfont"
                    ,"callback":function(){
                        $(this).parents(".ui-select").first().find(".ui-select-trigger").html($(this).html() + '<i class="iconfont" title="下三角形">&#xf03b;</i>');
                    }
            	})[0].show()[0].hide();
                if(selects.length > 0){
                    selects[0].show()[0].hide();
                }
            	
            });
     */
    function select(opts) {
    	// 函数返回值
		var revs = [];
		/*
		$.fn.setValue = function(value){
			$(this).trigger("DOMClick");
		}
        */
		
    	// 防JS报错，容错机制
		var opt = opts || {};
        var callback = typeof(opt.callback) == "function" ? opt.callback : function(){};
        var selectElements = $(opt.select);
        $.each(selectElements,function(){
            var me = this;
            (function(){
                var rev = null;
                var selectElement = $(me);
            
                var optionElement = selectElement.find(opt.option);
                //var iconElement = selectElement.find(opt.icon);
                if(selectElement.length < 1){
                    return false;
                }
                
                // 验证是否已经绑定过，绑定过不再绑定
                if(selectElement.data("isbindselectevent") === true){
                    return false;
                }else{
                    selectElement.data("isbindselectevent", true);
                }
                
                rev = {
                    hide:function(){
                        selectElement.find(opt.icon).html("&#xF03C;");
                        //iconElement.html("&#xF03C;");
                        optionElement.hide();
                        return revs;
                    }
                    ,show:function(){
                        selectElement.find(opt.icon).html("&#xf03b;");
                        //iconElement.html("&#xf03b;");
                        optionElement.show();
                        return revs;
                    }
                };
                revs.push(rev)
                
                selectElement.bind("click",function(e){
                    var isVisible = optionElement.is(":visible");
                    stopPropagation(e);
                    $(doc).trigger("DOMClick");
                    // 使用jquery的开关函数
                    if(isVisible){
                        rev.hide();
                    }else{
                        rev.show();
                    }
                });
                
                optionElement.find("a").bind("click", function(){
                    callback.call(this);
                });
                
                $(doc).bind("DOMClick",function(e){
                    rev.hide();
                });
            })();
        });
        
        
        
        
        // 绑定点本文档触click事件
        if($(doc).data("isadddomclick") !== true){
            $(doc).bind("click", function(){
                $(doc).trigger("DOMClick");
            })
            $(doc).data("isadddomclick", true);
        }
	    
		return revs;
    }

    module.exports = select;

});
