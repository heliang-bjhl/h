var $Le = $le = {
    extend: function(Sublass, BassClass) {
        var F = function() {};
        F.prototype = BassClass.prototype;
        Sublass.prototype = new F();
        Sublass.prototype.constructor = Sublass;
    },
    GUIDS: {},
    GUIDSNUM: 1,
    BassClass: function() {
        this.guid = $Le.GUIDSNUM;
        $Le.GUIDS[$Le.GUIDSNUM] = this;
        $Le.GUIDSNUM++;
    },
    reload: function() {
        setTimeout(function() {
            location.href = location.href;
        }, 1000)
    },
    //ajax成功code
    //
    //
    scode: 10000,
    /**
     * [parseTree 解析树为指定格式]
     * @param  {[type]} treedata [原始树的数据]
     * @param  {[type]} field    [根据指定字段返回新数据]
     * @param  {[boolen]} checked    [是否检测选中的]
     * @return {[type]}          [description]
     */
    parseTree: function(treedata, field, checked) {
        var T = treedata;
        var D = [];

        var fun = function(parent, data) {
            parent.name = data.name;
            parent.id = data.id;
            setChild(parent, data);
        }
        var setChild = function(parent, data) {
            if (data.children) {
                parent.children = [];
                for (var j = 0; j < data.children.length; j++) {
                    var d = data.children[j];
                    if (checked) {
                        if (d.checked == true) {
                            var o = getChildData(d);
                            parent.children.push(o);
                            setChild(o, d);
                        }
                    } else {
                        var o = getChildData(d);
                        parent.children.push(o);
                        setChild(o, d);
                    }
                }
            }
        }
        var getChildData = function(data) {
            var o = {}
            for (var key in field) {
                o[key] = data[key];
            }

            return o
        }
        for (var i = 0; i < T.length; i++) {
            var itData = T[i];
            if (checked) {
                if (itData.checked == true) {
                    var level0 = {};
                    fun(level0, itData);
                    D.push(level0)
                }
            } else {
                var level0 = {};
                fun(level0, itData);
                D.push(level0)
            }
        }

        return D;
    },
    /**
     * 取url参数
     *
     */
    getUrlParam: function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
        var r = window.location.search.substr(1).match(reg); //匹配目标参数
        if (r != null) return unescape(r[2]);
        return null; //返回参数值
    },
    alertDialog : function(Dialog,t){
        var dialog = new Dialog({
            title: '提示',
            content: t,
            isButton: false,
            width: 200
        })
        dialog.open();
        return dialog;
    },
    /**
     * [showDialogTip dialog提示]
     * @param  {[type]} Dialog [Dialog对象]
     * @param  {[type]} D      [数据]
     * @return {[type]}        [description]
     */
    showDialogTip: function(Dialog, D) {
        var dialog = new Dialog({
            title: '操作信息',
            content: '操作成功,即将跳转到首页...',
            isButton: false,
            width: 200
        })
        dialog.open();
        setTimeout(function() {
            location.href = D.data.url || location.href;
        }, 1500)
    },
    ajaxSuccess: function(json) {
        if (json && json.errno === $le.scode) {
            return true
        }
        return false;
    },
    ajaxFail: function(json, op) {
        if (op.tip) {
            op.tip.setContent('<div class="ui-msg ui-msg-error">' + json.error + '</div>')
        }
        setTimeout(function() {
            op.tip.close();
            op.button.removeClass('ui-button-disabled');
            op.button.removeClass('disabled');
        }, 1000)
    },
    zIndex: {
        highest: 100000
    },
    /**
     * [$le.getJsonLen 算json格式对象 有多少个key  类似数组的length]
     * @param  {[Object]} json [JSON]
     * @return {[Number]}      [json的length]
     */
    getJsonLen : function(json){
        var num = 0 ;
        for(var key in json ){
            num++
        }
        return num
    }
};

// seajs.config({
//     base: $$c.rootUrl,
//     alias: {
//         "tips": $$c.rootUrl + '/lejs/module/tips/1.0.1/tips.js',
//         "tips2": $$c.rootUrl + '/lejs/module/tips/1.0.2/tips.js',
//         "underscore": $$c.rootUrl + '/lejs/module/underscore/underscore-min.js',
//         "Handlebars": $$c.rootUrl + '/lejs/module/handlebars/handlebars-v2.0.0.js',
//         "dot": $$c.rootUrl + '/lejs/module/dot/dot.js',
//         "Dialog": $$c.rootUrl + '/lejs/module/dialog/1.0.1/dialog.js',
//         "selectMultiple": $$c.rootUrl + '/lejs/module/selectMultiple/1.0.1/selectMultiple.js',
//         "Validate": $$c.rootUrl + '/lejs/module/validate/1.0.1/validate.js',
//         "Go": $$c.rootUrl + '/lejs/module/go/1.0.1/go.js',
//         "moment": $$c.rootUrl + '/lejs/module/moment/moment.js',
//         "datepicker": $$c.rootUrl + '/lejs/module/datetimepicker/datetimepicker.js',
//         "zTree": $$c.rootUrl + '/lejs/third/ztree/jquery.ztree.all-3.5.min.js',
//         'bootstrap': $$c.rootUrl + '/lejs/third/bootstrap/bootstrap.js',
//         'json2': $$c.rootUrl + '/lejs/module/json2/json2.js',
//         'selectarea': $$c.rootUrl + '/lejs/module/selectarea/1.0.1/selectarea.js',
//         'colorpicker': $$c.rootUrl + '/lejs/module/colorpicker/1.0.1/colorpicker.js',
//         'formsend': $$c.rootUrl + '/lejs/module/formsend/1.0.1/formsend.js',
//         'pagination' : $$c.rootUrl + '/lejs/module/pagination/1.0.1/pagination.js',
//         'sortable' : $$c.rootUrl + '/lejs/module/sortable/1.0.1/sortable.js',
//         'upload': $$c.rootUrl + '/lejs/module/upload/1.0.1/upload.js',
//         'tag': $$c.rootUrl + '/lejs/module/tag/1.0.1/tag.js'

//     }
// });

/**
 * [封装模版引擎]
 * @dot  {[dot]} dot : dot 对象
 * @param  {[string]} html : 模版
 * @param  {[type]} opt : 模版数据
 * @return {[type]}
 */
$Le.tplRender = function(dot, tpl, opt) {
        var tempFn = dot.template(tpl);
        var html = tempFn(opt);
        return html;
    }
    /**
     * 全局广播通知;
     * 严格的区分了频道与事件的概念
     * @example
     * A模块内监听'com.myTest'频道下的say事件
     * $le.listener.on('com.myTest', 'say', function(d){alert(d);});
     *
     * B模块内触发'com.myTest'频道下的say事件
     * $le.listener.trigger('com.myTest', 'say', 'Hello World!');
     */
;
(function() {
    var EXECTIME = 50, //连续执行时间，防止密集运算
        DELAY = 25;

    var that = {},
        timer = '',
        slice = [].slice,
        channelList = {}; //用于保存被注册过所有频道
    /**
     * 通知监听
     * @param {String} channel 频道名
     * @param {String} type 事件类型
     * @param {Function} callback 事件响应
     * @param {Object} context 上下文环境
     */
    var on = function(channel, type, callback, context) {
        var curChannel = channelList[channel];
        if (!curChannel) {
            curChannel = channelList[channel] = {};
        }
        curChannel[type] = curChannel[type] || [];
        curChannel[type].push({
            'func': callback,
            'context': context || that
        });
    };

    /**
     * 通知监听, 执行一次后销毁
     * @param  {[type]}   channel  [description]
     * @param  {[type]}   type     [description]
     * @param  {Function} callback [description]
     * @param  {[type]}   context  [description]
     * @return {[type]}            [description]
     */
    var once = function(channel, type, callback, context) {
        var _once = function() {
            that.off(channel, type, _once);
            return callback.apply(context || that, arguments);
        };
        on(channel, type, _once, context);
    };

    /**
     * 事件触发
     * @param {String} channel
     * @param {String} type
     * @param {Object} data 要传递给相应函数的实参
     */
    var trigger = function(channel, type, data) {
        if (channelList[channel] && channelList[channel][type] && channelList[channel][type].length) {
            var taskList = channelList[channel][type];
            var curHandlers = [];
            for (var i = taskList.length; i--;) {
                curHandlers.push({
                    'handler': taskList[i],
                    'args': slice.call(arguments, 1)
                });
            }
            (function() {
                var start = +new Date();
                do {
                    var curTask = curHandlers.shift(),
                        handler = curTask.handler;
                    try {
                        handler.func.apply(handler.context, curTask.args);
                    } catch (exp) {}
                } while (curHandlers.length && (+new Date() - start < EXECTIME));
                if (curHandlers.length > 0) {
                    setTimeout(arguments.callee, DELAY);
                }
            })();
        }
    };

    /**
     * 事件监听移除
     * @param {String} channel 频道名
     * @param {String} type 事件类型
     * @param {Function} callback 要移除的事件响应函数句柄
     */
    var off = function(channel, type, callback, context) {
        context = context || that;
        if (channelList[channel] && channelList[channel][type] && channelList[channel][type].length) {
            var taskList = channelList[channel][type];
            var handler;
            for (var i = taskList.length; i--;) {
                handler = taskList[i];
                if (handler.func === callback && handler.context === context) {
                    taskList.splice(i, 1);
                }
            }
        }
    };

    that.on = on;
    that.once = once;
    that.trigger = trigger;
    that.off = off;

    $Le.listener = $Le.listener || that;
})();
/*!
 * Bootstrap v3.1.1 (http://getbootstrap.com)
 * Copyright 2011-2014 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */
