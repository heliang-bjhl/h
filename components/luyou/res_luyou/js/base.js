var LEC = {};
var $$c = {
    rootUrl : '../'
}
LEC.seaConfig = {
    base: $$c.rootUrl + 'res_luyou/js/module/',
    alias: {
        "Dialog":'dialog/dialog.js',
        "dot": 'dot/dot.js',
        "highcharts":'highcharts/highcharts.js'

    }
}
seajs.config(LEC.seaConfig);
var $Le = $le = {
    // 记录所有通用url 比如上传 tag等
    url: {
        upload: '/uploadPicture'
    },
    //hash
    hash: {
        set: function(hashValue) {
            window.location.hash = hashValue;
        },
        get: function() {
            return window.location.hash.replace(/#/, '');
        }
    },
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

            for (var key in field) {
                parent[key] = data[key];
            }
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
    /**
     * 取得所有参数
     * return json
     */
    getUrlAllParam: function() {
        var obj = {};
        var r = window.location.search.substr(1);
        var arr = r.split('&');
        for(var i=0;i < arr.length; i++) {
            var t = arr[i].split('=');
            if(t[0] in obj) {

            } else {
                obj[t[0]] = decodeURIComponent(t[1]);
            }
        }
        return obj;
    },
    alertDialog: function(Dialog, t) {
        var dialog = new Dialog({
            title: '提示',
            content: t,
            isButton: false,
            width: 200
        })
        dialog.open();
        return dialog;
    },
    /*
     * upload fileSize by zhangtonglai 添加上传文件返回文件大小 单位 MB KB
     */
    fileSize: function(size) {
        var str = '';
        if (size > 1024 * 1024) {
            str = (Math.round(size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
        } else {
            str = (Math.round(size * 100 / 1024) / 100).toString() + 'KB';
        }
        return str;
    },
    /**
     * [showDialogTip dialog提示 比如保存数据成功后,需要跳转到....]
     * @param  {[type]} Dialog [Dialog对象]
     * @param  {[type]} D      [数据]
     * @param  {[type]} content      [提示信息]
     * @return {[type]}        [description]
     */
    showDialogTip: function(Dialog, D, content) {
        var dialog = new Dialog({
            title: '操作信息',
            content: content || '操作成功,即将跳转到首页...',
            isButton: false,
            width: 200
        })
        dialog.open();
        setTimeout(function() {
            location.href = D.data.url || location.href;
        }, 1500)
    },
    dataTotimestamp: function(datastring) {
        //时间转化为时间戳(秒)，2014/11/22 10:34:34 下午 to 1416666874
        var reg1 = /上午/g;
        var reg2 = /下午/g;
        var reg;
        var param = 0;
        if (reg2.test(datastring)) {
            param = 12;
            reg = reg2;
        } else if (reg1.test(datastring)) {
            reg = reg1;
        } else {
            reg = '';
            param = 12;
        }
        var tempStr = datastring.replace(reg, '');
        var tempStr,arr;
        if(tempStr.indexOf('-') != -1) {
            tempStr = tempStr.replace(/:/g, '-').replace(/\s/, '-');
            arr = tempStr.split('-');
        } else if(tempStr.indexOf('/') != -1){
            tempStr = tempStr.replace(/:/g, '/').replace(/\s/, '/');
            arr = tempStr.split('/');

        }
        var minutes = new Date(Date.UTC(
            arr[0],
            arr[1] - 1,
            arr[2],
            arr[3] = parseInt(arr[3] - 8) + param,
            arr[4] || 0,
            arr[5] || 0
        ));
        return parseInt(minutes.getTime() / 1000);
    },
    getDateByFormat: function(sourceDate, format) {
        //sourceDate为 new Date(timestamp) timestamp为毫秒值
        var o = {
            "M+": sourceDate.getMonth() + 1, //月份
            "d+": sourceDate.getDate(), //日
            "h+": sourceDate.getHours() % 12 == 0 ? 12 : sourceDate.getHours() % 12, //小时
            "H+": sourceDate.getHours(), //小时
            "m+": sourceDate.getMinutes(), //分
            "s+": sourceDate.getSeconds(), //秒
            "q+": Math.floor((sourceDate.getMonth() + 3) / 3), //季度
            "S": sourceDate.getMilliseconds() //毫秒
        };
        var week = {
            "0": "/u65e5",
            "1": "/u4e00",
            "2": "/u4e8c",
            "3": "/u4e09",
            "4": "/u56db",
            "5": "/u4e94",
            "6": "/u516d"
        };
        if (/(y+)/.test(format)) {
            format = format.replace(RegExp.$1, (sourceDate.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(format)) {
            format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[sourceDate.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }

        return format;
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
    getJsonLen: function(json) {
        var num = 0;
        for (var key in json) {
            num++
        }
        return num
    },
    encodeTextVal: function(str) {
        var reg = /\n/g;
        while(reg.test(str)) {
            str = str.replace(reg, "<br>");
        }
        return str;
    },
    decodeTextVal: function(str) {
        var reg = /<br>/g;
        while(reg.test(str)) {
            str = str.replace(reg, "\n");
        }
        return str;
    },
    html2Escape: function(sHtml) {
     return sHtml.replace(/<>/g,function(c){
            return {'<':'&lt;','>':'&gt;','"':'&quot;'}[c];
        });
    },
    //整体页面状态
    plat: {
        ready: function() {
            $('#j_plat').show();
            $('#j_plat_state').hide();
            $le.listener.trigger('plat', 'ready', $$c.initData);
        },
        loading: function() {
            if ($le.hash.get()) {
                // alert($le.hash.get())
                $le.plat.ready();
                // $('#j_plat_state').html('<p class="ui-msg ui-msg-loading">页面初始化......</p>')
            } else {
                $le.plat.ready();
            }

        },

        init: function() {
            $le.plat.loading(); //表示平台数据已经准备好了
            $le.listener.on('plat', 'hash', function(act, hashData) {
                $le.hash.set(hashData);
            });
        }
    },
    openWindow : function(url){
        if(window === window.top){
            window.open(url)
        }else{
            parent.open(url)
        }
        
    }
};
//单页面对象
//$Le.sp.D 表示初始化数据 常量
//$Le.sp.P 储蓄数据 变量
$Le.sp = {
    D: {},
    P: {},
    _total: 0,
    itemReady: function() {
        $Le.sp._total++;
        if ($Le.sp._total === $Le.sp.total) {
            $Le.sp.ready();
        }
    },
    ready: function(Go) {
        $le.plat.init(Go);
    }
};
    //平台
$Le.BassPlat = function() {
    this._init(this);
}
$Le.BassPlat.prototype = {}

//设置每个Model
$Le.Model = function(op) {
    $.fn.extend(this, op);
    $Le.BassPlat.call(this);
}
$Le.extend($Le.Model, $Le.BassPlat);
/**
 * [Panel op]  必须包含_container _init
 */
$Le.Panel = function(op) {
    $Le.BassClass.call(this);
    $.fn.extend(this, op);
    this._init(this);
}
$Le.extend($Le.Panel, $Le.BassClass);
$Le.Panel.prototype = {
    _setCurPanel: function() {
        $Le.Panel.curPanelId = this.guid;
    },
    show: function() {

        if ($Le.Panel.curPanelId == this.guid) {
            return
        } else {
            try {
                $Le.GUIDS[$Le.Panel.curPanelId].hide();
            } catch (e) {}

            this._setCurPanel();
            this._container.show();
        }
    },
    hide: function() {
        this._container.hide()
    }
}

//扩展方法
$Le.ext = {
    up : {
        getItemHtml : function(opt){
            
            var w = opt.img.css_w;
            var h = opt.img.css_h;
            var ww = opt.img.original_w;
            var hh = opt.img.original_h;
            var className = opt.img.className;
            if(className){
                var html = [
                            '<div class="ui-up-item '+className+'">',
                                '<div class="ui-up-text">' + ww + 'x' + hh + '</div>',
                                '<div class="ui-up-img" ></div>',
                                '<div class="ui-up-mask"></div>',
                                '<div class="ui-up-progress"><p></p></div>',
                            '</div>'
                ].join('');
                
            }else{
                var html = [
                        '<div class="ui-up-item"  style="width:' + w + 'px;height:' + h + 'px">',
                            '<div class="ui-up-text">' + ww + 'x' + hh + '</div>',
                            '<div class="ui-up-img" style="width:' + w + 'px;height:' + h + 'px"></div>',
                            '<div class="ui-up-mask"></div>',
                            '<div class="ui-up-progress"><p></p></div>',
                        '</div>'
                ].join('')
            }
            
            return html;
        },
        getUpDialogHtml: function(opt) {
            var w = opt.img.css_w;
            var h = opt.img.css_h;
            var ww = opt.img.original_w;
            var hh = opt.img.original_h;
            var html = [
                '<div style="height:300px">',
                    '<div id="j_up_bt"></div>',
                    '<div class="ui-up-box mt10">',
                        '<div id="j_up_box" >' + $Le.ext.up.getItemHtml(opt) + '</div>',
                    '</div>',
                    '<div class="tr mt10"><div class="rel">',
                         '<input type="button" class="ui-button ui-button-disabled" value="确定" id="j_up_confirm" data-user-op="userConfirm"></div>',
                          '<input type="button" class="ui-button j_op" value="取消" data-dialog-op="cancel" style="margin-left:10px" />',
                     '</div>',
                '</div>'
            ].join('');
            return html;
        },
        setPic : function(op){
            var box = op.upbox;
            var url = op.imgUrl;
            var img = '<img src="' + url + '"  />'
            box.find('.ui-up-img').html(img);
        },
        bindUpload: function(opt) {
            var Upload = opt.m.Upload;
            var w = opt.img.css_w;
            var h = opt.img.css_h;
            // var ww = opt.img.original_w;
            // var hh = opt.img.original_h;
            var up_box =  opt.upbox;
            var upSuccess = opt.upSuccess || function(){};
            var beforeItemSend = opt.beforeItemSend || function(){};
            var extendData = opt.extendData || {};
            var setProgress = function(progress){
                var p = parseInt(progress * 100) + '%';
                up_box.find('.ui-up-progress').show();
                up_box.find('.ui-up-progress p').width(p).html(p);
            }
            var fail = function(){
                up_box.find('.ui-up-progress p').html('上传失败');
            }
            var suc = function(){
                up_box.find('.ui-up-progress p').html('上传成功');
            }
            
            var up = new Upload({
                url: opt.upUrl,
                fileBox: opt.fileBox || $('#j_up_bt'),
                label: opt.label || '上传壁纸',
                progress: function(loaded, total, upkey) {
                    var progress = loaded / total;
                    

                    if(progress == 1){
                        progress = 0.99;
                    }
                    setProgress(progress);
                },
                beforeItemSend : function(key){
                    beforeItemSend(key)
                },
                extendData : extendData,
                fileQueued: function() {
                    up_box.find('.ui-up-img').html('')
                    $('#j_up_confirm').addClass('ui-button-disabled');
                    up_box.find('.ui-up-progress').hide();
                    up_box.find('.ui-up-progress p').width('0')
                        //文件上传
                    up.send();
                },
                successItem: function(json, upkey) {
                    $Le.ext.up.setPic({
                         upbox : up_box,
                         imgUrl : json.data.thumbnail ||  json.data.url
                    })
                    
                    $('#j_up_confirm').removeClass('ui-button-disabled');
                    $Le.listener.trigger('ext.up','successItem',json)
                    upSuccess(json.data);
                    suc(1);
                    // console.log(json);
                    // alert('上传成功 通过json可以拿到数据')
                },
                failItem : function(){
                    fail();
                },
                //文件类型
                accept: {
                    extensions: 'gif,jpg,jpeg,bmp,png',
                     mimeTypes: 'image/*'
                }

            });
        }
    }
}

$Le.ext.ajaxDialog = function() {}
$Le.ext.upDialog = {
    _data: {
        thumbnail : ''
    },
    reset: function() {

    },
    
    init: function(opt) {
        var tip = null;
        var Dialog = opt.m.Dialog;
        var Tips = opt.m.Tips;
        var Go = opt.m.Go;
        //当前页面的 上传窗口
        var dialog = new Dialog({
            title: opt.title || '',
            content: $Le.ext.up.getUpDialogHtml(opt),
            width: 600,
            isButton: false,
            closeFun: function() {},
            // model: 'hide',
            userConfirm: function(dom) {
                if (dom.hasClass('ui-button-disabled')) {
                    return false
                } else {
                    var data = $.extend(opt.data,{
                       thumbnail:  $Le.ext.upDialog._data.thumbnail
                    })
                    new Go({
                        url: opt.confirmUrl,
                        data: data,
                        type: 'post',
                        success: function(json) {
                            if ($le.ajaxSuccess(json)) {
                                tip.setContent('<div class="ui-msg ui-msg-suc">提交成功</div>');
                                
                                setTimeout(function() {
                                    dialog.close();
                                    tip.hide();
                                    opt.callback($Le.ext.upDialog._data.thumbnail)
                                }, 500)
                            } else {
                                $le.ajaxFail(json, {
                                    button: dom,
                                    tip: tip
                                })
                            }
                        },
                        beforeSend: function() {
                            dom.addClass('ui-button-disabled')
                            tip = new Tips({
                                button: dom,
                                content: '<div class="ui-msg ui-msg-loading">提交中</div>'
                            })
                            tip.show();
                        },
                        dataType: 'json'
                    })
                }
            },
            afterOpen: function(me) {
                opt.upbox = $('#j_up_box');
                $Le.ext.up.bindUpload(opt)
            }
        })
        dialog.open();

                        

    }
    
}

//静态方法
$Le.Panel.curPanelId = -1;

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