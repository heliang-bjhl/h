define('custom/setanchor/setanchor-debug', [], function(require, exports, module) {
	
    var $ = require("jquery");
    // 暂认为一个页面只有一个这种需求，不做队列
    var stime = null;
    var timeId = null;
    
	/** 设置锚点
	 *
	 *  暂时不提供反设置（给点某点滚动到该点的区域）
	 *
	 *  @author	ywchen(陈余文)
	 *  @date	2014.03.10
	 *
     *	@param {object}         opts 			参数
     *		   {HTMLElement}    opts.ele		*区域锚点集
     *		   {function}       opts.callback	回调，参数为锚点集的当前锚点索引
     *		   {Number}         opts.offset	    偏移值
 	 *
     *	@return 无
     *
     *	@eg.
	 */
    function setAnchor(opts) {
        var rev = {};
        var opt = opts || {};
        // 容错 & 减少后面的逻辑复杂度
        opt.callback = typeof(opt.callback) == "function" ? opt.callback : function(){};
        opts.offset = (opts.offset == null || isNaN(opts.offset)) ? 0 : opts.offset;
        var scrollFn = function(){
            limit(opt);
        }
        
        $(window).bind("scroll",scrollFn);
        rev.init = function(){
            limit(opt);
        }
        rev.unbind = function(){
            $(window).unbind("scroll",scrollFn);
            opt.callback = null;
            opt = null;
            rev = null;
            stime = null
        }
        return rev;
    }
    
    // 做触发限制
    function limit(opt){
        
        var etime = new Date().getTime();
        var time = etime - stime;
        var timer = 200;
        
        clearTimeout(timeId);
        if(stime != null && time < timer){
            timeId = setTimeout(function(){
                deal(opt);
            },timer + 5);
            return false;
        }
        
        stime = etime;
        deal(opt);
    }
    
    // 功能主体
    function deal(opt){
        var index = 0;
        var elements = $(opt.ele);
        var element = elements.get(0);
        $.each(elements, function(i){
            // 查找最后一个在滚动条中的元素，并取得在区域集中的索引
            if(($(this).offset().top + opt.offset) < $(window).scrollTop()){
                index = i;
                element = this;
            }else{
                return false;
            }
        });
        opt.callback.call(element,index);
    }

    module.exports = setAnchor;

});
