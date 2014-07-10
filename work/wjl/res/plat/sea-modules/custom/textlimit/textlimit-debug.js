define('custom/textlimit/textlimit-debug', [], function(require, exports, module) {
	
    var $ = require("jquery");
    
    function getChangeEvent(){
	    var isIE = !!window.ActiveXObject;
	    return isIE?'propertychange':'input';
	};
	
	/** 字符统计
	 *
	 *  自定义了DOMChange事件（本插件外部不建议调用，该事件在setValue中被派发，
	 *  用于解决非IE下的被赋值不触发事件的问题); 并提供了Jquery的setValue函数，用于在程序代码中赋值让计数器生效。
	 *  暂不考虑在返回值中提供事件解绑函数
	 *
	 *  @author	ywchen(陈余文)
	 *  @date	2014.03.03
	 *
     *	@param {object} 			opts 			参数
     *		   {element}			opts.input		*输入框dom，无默认值
     *		   {element}			opts.tip		显示信息dom,无默认值
     *		   {Number}				opts.max		可输入的最大字数,默认300
     *		   {Number}				opts.mix		最小必须输入的字数，默认0
     *		   {boolean}			opts.enableBr	是否可输入换行，默认换行
     *		   {function}			opts.changeFn	内容改变回调
     *		   {function}			opts.getValue	取值回调
 	 *		   {string|function}	opts.msg		取显示模板信息,参数{"max":max,"min":min,"count":count,"rest":rest}
	 *												必须有返回值，返回值中可含"{max}"、"{min}"、"{count}"、"{rest}"这些字符串
 	 *
     *	@return 可操作对象
     *
     *	@eg.
     	seajs.use(["$","textLimit"], function(textLimit){
			textLimit({
				"input":"#txtContent"
				,"tip":"#lblCount"
				//,"msg":"字数 {count}/{max}"
				,"msg":function(opt){
					return "最大可输入数：{max}最小必须输入数{min}已经输入数{count}还有多少可输入数 {rest};" + opt.count;
				}
				,"max":300
				,"min":0
				,"enableBr":true
				,"changeFn":function(){
					//console.log(1)
				}
			}).init();
			
			$("#btnSubmit").click(function(){
				$("#txtContent").setValue("通过js程序赋值，并可计数");
			});
		});
	 */
    function textLimit(opts) {
    	// 函数返回值
		var rev = {
			init:function(){
				
			}
		};
		
		$.fn.setValue = function(value){
			$(this).val(value);
			$(this).trigger("DOMChange");
		}
		
    	// 防JS报错，容错机制
		var opt = opts || {};
		
		var inputElement = $($(opt.input).get(0));				// 输入框dom
		if(inputElement.length == 0) return rev;				// 没有输入框直接退出
		var tipElement = $(opt.tip);							// 显示输入字长度dom
		var max = opt.max || 300;								// 最大可输入的字长度
		var min = opt.min || 0;									// 最小必须多少个字
	    var enableBr = opt.enableBr === true ? true : false;	// 是否允许换行,默认不换行
	    // 派发出来的内容改变事件
	    var changeFn = typeof(opt.changeFn) == "function" ? opt.changeFn : function(){};
	    // 统计字数时的有效字取得
	    var getValue = typeof(opt.getValue) == "function" ? opt.getValue : function(value){return value};
	    // 显示信息
		var tipMsg = opt.msg || "max:{max}min:{min}count:{count}rest:{rest}";
		var lastValue = null;
		var tipMsgFn = typeof(tipMsg) == "function" ? tipMsg : function(){return tipMsg};
		
		var getCutDefVal = function(value){
			// 输入的内容
	        var originalVal =  getValue.call(inputElement,inputElement.val());
	        // 处理过的内容
	        var cleanVal = enableBr? originalVal : originalVal.replace(/[\r\n]/g, " ");
	        return cleanVal;
		}
		
	    // 输入响应事件
	    var inputEventFn = function(){
	    	var value = $(this).val();
	        lastValue = getCutDefVal();
	        if(value != lastValue){
	        	$(this).val(lastValue);
	        }
	        var cleanVal,           //处理过的内容
	            count,				//输入内容的字数
	            rest,               //还能输入的字数
	            caretPos,           //当前光标的位置
	            message;

	        cleanVal = getCutDefVal();
	        count = cleanVal.length;
	        rest = max - count;
	        rest = rest > 0 ? rest : 0;
	        var option = {
        		"max":max
        		,"min":min
        		,"count":count
        		,"rest":rest
	        }
	        if(tipElement && tipElement.length > 0){
	        	tipElement.html($.trim(tipMsgFn(option)).replace(/{\w+}/g,function(s){
	        		return $.trim(option[s.replace(/[{}]/g,"")]);
	        	}));
	        }
	        
	        changeFn.call(this);
	    }
	    
		// 事件已经绑定过不再绑定
		if(inputElement.attr("data-isbindevent") !== true){
			
			// 绑定事件
			inputElement.bind(getChangeEvent() + ' keyup paste DOMChange',function(){
		        if(lastValue != null && lastValue == getCutDefVal())
		        {
		            return;
		        }
		        
		        // 下面两句话顺序不能对调
		        inputEventFn.apply(this,arguments);
		        
		    }).keypress(function(e){
		        return enableBr? true : e.keyCode !== 13;
		    });
		    
			// 设置已经绑定的标识
			inputElement.attr("data-isbindevent", true);
		}
		
		// 提供初始化函数
		rev.init = function(){
			inputElement.trigger("DOMChange");
			return inputElement;
		}
	    
		return rev;
    }

    module.exports = textLimit;

});


//textLimit({input:"#txtTitle","tip":"#lblCount",ms:"pp{count}"});