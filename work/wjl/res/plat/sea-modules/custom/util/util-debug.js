define("custom/util/util", ["$", "_", "tip"], function(require, exports, module) {
    var $ = require("$"),
        _ = require("_"),
        Tip = require("tip"),
        ConfirmBox = require("confirmbox");

    Util = {

        //默认dialog无法修改title 与 content 故重写，建议用新的dialog方法 by liang
        setDialog: function(dialog, type, c) {
            if (type == 'title') {
                dialog.element.find('.ui-dialog-title').html(c);

            }
            if (type == 'content') {
                dialog.element.find('.ui-dialog-message').html(c);
            }
        },
        delSelect: function(s) {
            $(s.element).remove();
            s = null;
        },
        //重新封装 ConfirmBox
        confirm: {
            open: function(op) {
                Util.confirm._clear();
                Util.confirm.d = new ConfirmBox({
                    title: op.title,
                    message: op.message,
                    confirmTpl: op.confirmTpl,
                    cancelTpl: op.cancelTpl,
                    onConfirm: function() { // 通过
                        op.onConfirm();
                    },
                    onCancel: function() { // 拒绝
                        op.onCancel();
                    },
                    onClose: function() {
                        if (op.onClose) {
                            op.onClose();
                        }

                    },
                    width: op.width
                });
                Util.confirm.d.show();
            },
            d: null,
            _clear: function() {
                Util.confirm.d = null;

            },
            close: function() {
                Util.confirm.d = null;
                $('.arale-dialog-1_2_5').remove();

            }
        },
        init: function() { //调用全局的通用的方法，所有页面都需要的
            //this.fixedDom(".asidenav");
            //分页跳转
            this.pager();
            //this.asideToggle();
        },
        formSend: function(formSelector, opts) {
            var form = $(formSelector);
            if (!form.length) {
                return;
            }
            var url = form.attr("action");

            opts = opts || {};

            //form中额外的数据
            opts.extraData = opts.extraData || null;
            opts.data = form.serialize();

            //额外的参数
            if (_.isObject(opts.extraData)) {
                opts.data = [].concat(opts.data).concat($.param(opts.extraData)).join("&");
            }
            opts.form = formSelector;
            this.send(url, opts);
        },
        send: function(url, opts) {
            var me = this,
                promt = null,
                submitBtn = null,
                bShowPromt = false,
                data = opts.data || null,
                tips = null,
                tipsContent = null;
            opts = opts || {};
            opts.type = opts.type || "post";
            //ajax成功后是否刷新页面
            opts.bReload = opts.bReload || false;
            //ajax提示出在哪个位置
            opts.submitButton = opts.submitButton || $(opts.form).find(":submit");
            //防ajax重复
            var ajaxElement = $(opts.submitButton);


            url = opts.url || url;
            //转义
            if (_.isObject(opts.data)) {
                data = $.param(opts.data);
            }
            //请求过程发生错误的默认提示
            opts.ajaxErrorMsg = opts.ajaxErrorMsg || "出错了,请重新提交！";
            //请求过程出错callback
            opts.error = opts.error || null;

            //请求过程中的要显示的文字
            opts.loadingTxt = opts.loadingTxt || "提交中...";
            opts.successTxt = opts.successTxt || "提交成功!";
            //定位的位置，默认为top
            opts.position = opts.position || "top";
            //默认多久关闭ajax提示信息
            opts.delay = opts.delay || 1000;
            submitButton = $(opts.submitButton);
            //bajax表示正在发生ajax请求
            if (!url || ajaxElement.data("bajax") == "1") {
                return;
            }
            var disableAjax = function() {
                //默认把蓝色的按钮，改为禁用按钮 ajax禁止
                if (submitButton.hasClass("ui-button-morange")) {
                    submitButton.removeClass("ui-button-morange").addClass("ui-button-mwhite")
                }
                if (submitButton.hasClass("ui-button-lorange")) {
                    submitButton.addClass("ui-button-lwhite ")
                }
                if (ajaxElement.length) {
                    ajaxElement.data("bajax", 1);
                }

            }
            var enableAjax = function() {
                //默认把蓝色的按钮，
                if (submitButton.hasClass("ui-button-mwhite")) {
                    submitButton.removeClass("ui-button-mwhite").addClass("ui-button-morange")
                }
                if (submitButton.hasClass("ui-button-lwhite")) {
                    submitButton.removeClass("ui-button-lwhite ")
                }
                if (ajaxElement.length) {
                    ajaxElement.data("bajax", 0);
                }
            }

            //ajax 正在载入状态
            if (opts.submitButton) {
                //把按钮中的字显示到loading状态中
                tips = submitButton.data("tips") || new Tip({
                    trigger: submitButton,
                    triggerType: "click",
                    effect: 'fade',
                    // content: '<span class="ui-poptip-status poptip-loading">' + opts.loadingTxt + '</span>',
                    content: opts.loadingTxt,
                    theme: "white"
                });
                tips.show();
                tipsContent = tips.element.find(".ui-poptip-content").attr("class", "ui-poptip-content poptip-loading");
                submitButton.data("tips", tips);

            }
            $.ajax({
                type: opts.type,
                cache: false,
                url: url,
                dataType: 'json',
                data: opts.data,
                beforeSend: function() {
                    disableAjax();
                    if (tips) {
                        tipsContent.html(opts.loadingTxt);
                        tips.element.show().css("opacity", 100);
                    }
                },
                success: function(data) {
                    if (opts.success) {
                        //如果传入了success,自己处理所有逻辑
                        opts.success(data);
                        tips.element.hide();
                        return;
                    }
                    data = data || {};
                    if (data.code === 200) {
                        opts.ajaxSuccess && opts.ajaxSuccess(data);
                        if (opts.bReload) {
                            setTimeout(function() {
                                location.reload();
                            }, 200);
                        }
                        //关闭提示
                        if (tips) {
                            tipsContent.attr("class", "ui-poptip-content poptip-success").html(opts.successTxt);
                            // tipsContent.html('<div class="ui-poptip-status poptip-loading">' + opts.successTxt + '</div>');
                            tips.element.show();
                            //3秒自动消失
                            setTimeout(function() {
                                tips.element.fadeOut();
                            }, 3000)
                        }
                    } else {
                        if (opts.ajaxFail) {

                            opts.ajaxFail(data, tips);
                            return;
                        } else {
                            if (tips) {
                                tipsContent.attr("class", "ui-poptip-content poptip-error").html(data.msg || "出错了");
                                tips.element.show();
                                enableAjax();
                            }
                        }
                        if (data.code === 1) {
                            opts.ajaxSuccess && opts.ajaxSuccess(data);
                        }
                    }

                },
                error: function() {

                    if (opts.error) {
                        opts.error();
                        return;
                    } else { //调试用
                        if (tips) {
                            tipsContent.attr("class", "ui-poptip-content poptip-error").html(data.msg || "出错了,请尝试重新提交");
                            tips.element.show();
                        }
                        setTimeout(function() {
                            enableAjax();
                            tips.element.fadeOut();
                        }, 3000)
                        // alert("后端接口出错");
                    }
                },
                complete: function() {

                    if (ajaxElement.length) {
                        ajaxElement.data("bajax", 0);
                    }
                    if (tips) {
                          
                            tips.element.hide();
                        }
                    enableAjax()

                }
            });

        },
        fixedDom: function(dom, opts) {
            if (!$(dom).length) {
                return;
            }
            var dom = $(dom);
            $(window).on("scroll", function() {
                var scrollTop = $(window).scrollTop();


                if (scrollTop > 50) {
                    dom.css({
                        "position": "fixed",
                        "top": 0
                    });
                }
                if (scrollTop < 50) {
                    dom.css({
                        "position": "static"
                    });
                }
            });
            return
            if (!$(dom).length) {
                return;
            }
            var dom = $(dom),
                top = dom.offset().top,
                contentHeight = $("#content").height(),
                domHeight = dom.height(),
                footerTop = $(".ui-footer").offset().top + parseInt($(".ui-footer").css("margin-top"), 10);

            $(window).on("scroll", function() {
                var scrollTop = $(window).scrollTop(),
                    offsetTop = dom.offset().top;

                if (scrollTop > top) {
                    if (domHeight + scrollTop + top >= footerTop) {
                        dom.css({
                            "position": "absolute",
                            top: contentHeight - domHeight
                        });
                    } else {
                        dom.css({
                            "position": "fixed",
                            "top": 0
                        });
                    }
                } else {
                    dom.css({
                        "position": "absolute",
                        "top": 0
                    });
                }
            });
        },
        textLimit: function(input, tip, opts) {
            opts = opts || {};
            seajs.use("textLimit", function(textLimit) {
                textLimit({
                    "input": input || "#inputTitle",
                    "tip": tip || "#titleLimit"
                    //,"msg":"字数 {count}/{max}"
                    ,
                    "msg": opts.msg || function(opt) {
                        var opts = opt || {};
                        if (opts.max - opts.count < 0) {
                            return "输入已经超过了可允许的{max}字数";
                        } else {
                            return "还能输入{rest}个字";
                        }
                    },
                    "max": opts.max || 20,
                    "min": opts.min > 0 ? opts.min : 0,
                    "enableBr": true,
                    "changeFn": function() {
                        //console.log(1)
                    }
                }).init();
            });
        },
        bindUpload: function(selector, opts) {
            var data = {
                timestamp: "",
                token: "",
                signature: "111",
                policy: "11"

            };

            var noFlash = ['<li class="no-flash">',
                '<p>您还没有安装flash插件，请点击<a target="_blank" href="http://www.adobe.com/go/getflash">这里</a>安装您将被带到Adobe官网下载</p>',
                '</li>'
            ].join("");
            var me = this;
            opts = opts || {};

            if (!swfobject.hasFlashPlayerVersion("9")) {
                $(selector).closest("ul").html(noFlash);
                return false;
            }
            var _p = {
                hideFlash: function() {
                    var flash = $(selector);
                    flash.css({
                        position: "absolute",
                        left: "-10000px"
                    });
                },
                showFlash: function() {
                    var flash = $(selector);

                    flash.css({
                        position: "static"
                    });
                }
            }
            // 初始化上传组件
            $(selector).uploadify(_.extend({
                height: 152,
                width: 153,
                buttonImage: $$c.staticUrl + "/static/images/upload.png",
                fileSizeLimit: opts.imgSize || "100kb",
                swf: $$c.domain + "/uploadify.swf",
                uploader: $$c.uploadUrl,
                multi: false,
                fileObjName: "file",
                progressData: "speed",
                'fileTypeDesc': 'Image Files',
                'fileTypeExts': '*.gif; *.jpg; *.png',
                method: "post",
                auto: false,
                onSelect: function() {
                    var flash = $(selector);
                    $.ajax({
                        type: "GET",
                        url: $$c.domain + '/upai/key.aj',
                        dataType: 'json'
                    }).done(function(json) {
                        data.policy = json.data.policy;
                        data.signature = json.data.signature;
                        $(flash).uploadify('upload', '*');

                    });
                },
                onDialogClose: function(queueData) {
                    if (!queueData.filesSelected) {
                        return;
                    }

                },
                onUploadStart: function() {
                    _p.hideFlash($(this));
                    var flash = $(selector);
                    flash.uploadify('settings', 'formData', data);
                },
                onUploadError: function() {},

                onError: function() {

                },
                onUploadComplete: function() {},
                onUploadSuccess: function(file, data, response) {

                    var html = "",
                        flash = $(this)[0].wrapper,
                        uploadBtn = null,
                        curImg = null;
                    var json = $.parseJSON(data);
                    var url = $$c.resHost + "/" + json.url;
                    html += "<li><div class='control'><span class='close'></span></div><span class='blue-border'></span><img class='loaded-img' data-src='" + json.url + "' src=" + url + " /></li>";
                    uploadBtn = this.wrapper.closest(".btn-upload");
                    uploadBtn.before(html);
                    // console.log(flash)
                    if (opts && opts.max && opts.max <= $(selector).closest('ul').find('li').length) {

                    } else {
                        _p.showFlash($(this));
                    }


                    curImg = uploadBtn.prev().find(".loaded-img");
                    me.imgCenterScale(curImg, 153, 152);
                }
            }, opts));
            if (opts && opts.max && opts.max <= $(selector).closest('ul').find('li').length && opts.init == 1) {
                _p.hideFlash($(selector));
            } else {
                _p.showFlash($(selector));
            }

            //绑定删除事件
            $(selector).closest("ul").on("click", ".close", function() {
                $(this).closest("li").remove();
                _p.showFlash();
            })
        },
        //缩放，居中图片
        imgCenterScale: function(img, maxW, maxH, opts) {
            img = $(img);
            opts = opts || {};

            img.each(function() {
                var thisImg = $(this),
                    oImg = new Image();
                oImg.onload = function() {
                    loadImg(thisImg, this);
                }
                oImg.src = $(this).attr("src");
            });

            function loadImg(img, orgImg) {
                var imgW = parseInt(orgImg.width, 10),
                    imgH = parseInt(orgImg.height, 10),
                    ratio = null,
                    imgRatio = imgW / imgH,
                    resizeW = imgW,
                    resizeH = imgH,
                    doneSize = {};

                if (isNaN(parseInt(imgW))) {
                    return;
                }
                ratio = Math.min(maxW / imgW, maxH / imgH);
                resizeW = imgW * ratio;
                resizeH = imgH * ratio;

                //垂直居中
                if (imgH < maxH || resizeH < maxH) {
                    if (!img.prev().hasClass(".vh")) {
                        $("<span class='vh'></span>").insertBefore(img);
                        img.css("vertical-align", "middle");
                    }
                }
                if (imgH < maxH && imgW < maxW) {
                    return;
                }
                img.css({
                    width: resizeW,
                    height: resizeH
                });
                opts.callback && opts.callback();
            }
        },
        //分页的跳转样式
        pager: function() {
            var pagerInput = $(".ui-paging-which");
            var href = location.href;
            var reg = /pageNo=\d+/g;
            var url = '';

            function jump(input) {
                if (isNaN(parseInt(input))) {
                    input = 1;
                }
                if (reg.test(href)) { //表示有pageNo
                    url = href.replace(/pageNo=\d+/g, function(a, b) {
                        return 'pageNo=' + input;
                    })

                    location.href = url
                } else {
                    if (/\?/.test(href)) {
                        location.href = href + '&pageNo=' + input;
                    } else {
                        location.href = href + '?&pageNo=' + input;
                    }

                }
            }
            if (!$(".ui-paging-which").length) {
                return;
            }
            pagerInput.on("keydown", "input", function(e) {
                if (e.keyCode == 13) {
                    jump($(this).val());
                }
            })
            $(".ui-paging").on("click", ".ui-paging-goto", function() {
                jump($('.ui-paging-which input').val());
                return false;
            });



        },
        //侧边栏伸缩功能

        alert: function(msg, callback) {
            //window.alert(msg);
            var dialog = null;
            seajs.use(["confirmbox"], function(ConfirmBox) {
                var html = [
                    '<div class="dialog-form">', msg, '</div>'
                ].join("");

                dialog = new ConfirmBox({
                    title: '消息对话框',
                    message: html,
                    confirmTpl: '<span class="ui-dialog-button-orange">确定</span>',
                    cancelTpl: '',
                    onConfirm: function() { // 通过
                        this.hide();
                    }
                });
                dialog.show();
            });
            //return dialog;
        },


        /** 选择框的状态设置
         *
         *  @param {Array}  config  配置
         *  @param {Number} config[].index  索引是第几个不打开后面的输入框，默认为1
         *  @eg.
            HTML：
                <p class="ui-form-text">
                    <input value=""  name="undercarriageDate" type="radio" checked="checked">
                    <label for="">与优惠券实效时间相同</label>
                    <input value=""  name="undercarriageDate" type="radio" >
                    <label for="">指定下架时间</label>
                    <input placeholder="" id="txtUndercarriageDate" class="ui-input ui-input-large" type="text">
                </p>
            JS：
                var config = [
                    // 领取开始时间
                    {
                        "name":"startGroundingDate"
                        ,"input":"#txtStartGroundingDate"
                        ,"index":1
                    }
                    // 上架时间
                    ,{
                        "name":"groundingDate"
                        ,"input":"#txtGroundingDate"
                    }
                    // 下架时间
                    ,{
                        "name":"undercarriageDate"
                        ,"input":"#txtUndercarriageDate"
                    }
                ];
         */
        changeRadio: function(config) {

            // 配置为空不处理
            if (config == null) {
                return false;
            }

            // 状态改变处理函数

            function setRadioStatus(index, item) {
                var input = item.input;
                var curIndex = item.index;
                var disable = item.disable;
                var enable = item.enable;
                var ele = typeof(input) == "function" ? input() : input;
                curIndex = ($.trim(curIndex) == "" || isNaN(curIndex)) ? 1 : curIndex;
                // 防止该组件影响其它组件
                try {
                    if (index == curIndex) {
                        $(ele).removeAttr("readonly");
                        $(ele).removeAttr("disabled");
                        enable();
                    } else {
                        disable();
                        $(ele).attr("disabled", "disabled");
                        $(ele).attr("readonly", "true").val("");
                    }
                } catch (e) {}
            }

            // 引用相关信息 
            seajs.use(["$"], function($) {
                $(function() {
                    var list = config;
                    $.each(list, function(m, items) {
                        (function() {
                            var item = items;
                            item.disable = typeof(item.disable) == "function" ? item.disable : function() {};
                            item.enable = typeof(item.enable) == "function" ? item.enable : function() {};
                            $('input[name="' + item.name + '"]').click(function() {
                                setRadioStatus($('input[name="' + item.name + '"]:checked').index('input[name="' + item.name + '"]'), item);
                            });
                            setRadioStatus($('input[name="' + item.name + '"]:checked').index('input[name="' + item.name + '"]'), item);
                        })();
                    });
                });
            });

        },

        /*拼接日期字符串*/
        timeToString: function(opt) {
            var date = opt.date || '',
                hour = opt.hour,
                minute = opt.minute,
                type = opt.type; //type = date 表示 2013-12-22 00:00 其他表示 00:00
            var s = "";
            if (type == "date") {
                s = $.trim($(date).val()) + " " + $(hour).val() + ":" + $(minute).val();
            } else {
                s = $(hour).val() + ":" + $(minute).val();
            }
            return s;
        },
        /*倒计时函var json = json || {};
                 if (json.data && json.data.url) {
                     location.href = json.data.url;
                 } 数*/
        countDown: function(opt) {
            var timer;
            var time = opt.time || 2000; //多少毫秒后执行操作
            var timeCallBack = opt.timeCallBack || function() {}; //每个一秒钟执行的函数
            var finalyCallBack = opt.finalyCallBack || function() {}; //time好眠后执行的函数
            time = time / 1000;
            timer = setInterval(function() {
                if (time >= 1) {
                    time -= 1;
                    timeCallBack(time);
                } else {
                    clearInterval(timer);
                    finalyCallBack();
                }
            }, 1000);
        },
        //通用ajax请求跳转回调
        go: function(json, callback) {
            if (callback) {
                callback();
            }

            var json = json || {};
            if (json.data) {
                if (json.data.url) {
                    location.href = json.data.url;
                } else {
                    location.href = location.href;
                }

            } else {
                location.href = location.href;
            }

        },
        joinCheckboxVal: function(faSelector) {
            var valueArr = [];
            $(faSelector).find('input:checked').each(function() {
                valueArr.push($(this).val());

            });
            return valueArr.join(',');
        },
        //文本框内容限制为数字
        limitnum: function(opt) {
            var parentClass = opt.parentClass;
            var mold = opt.mold || 'float';
            $(parentClass).on('keyup', 'input', function() {
                if ($(this).data('rule') == 'num' || $(this).data('num') == 'num') {
                    var str = $(this).val();
                    if (mold == 'int') {
                        var intStr = parseInt(str) + '';
                        if (isNaN(intStr)) {
                            $(this).val('');
                        } else {
                            $(this).val(intStr);
                        }
                    } else if (mold == 'float') {
                        var floatStr = parseFloat(str) + '';
                        if (isNaN(str)) {
                            if (floatStr == 'NaN') {
                                $(this).val('');
                            } else {
                                $(this).val(floatStr);
                            }
                        }
                    } else {
                        return false;
                    }
                }
            });
        },
        //取当前时间
        getCurrentDate: function() {
            var nowDate = new Date();
            return (nowDate.getFullYear() + '-' + (nowDate.getMonth() + 1) + '-' + nowDate.getDate());
        },
        //以当前时间为起点 取day天后的日期
        getDateRangeTime: function(time, range) {
            var curday = new Date();
            var year = parseInt(time.split('-')[0]),
                mon = parseInt(time.split('-')[1]),
                day = parseInt(time.split('-')[2]);

            curday.setFullYear(year, mon - 1, day);
            curday.setDate(day + range);
            var finalDay = curday.getFullYear() + "-" + (curday.getMonth() + 1) + "-" + curday.getDate();
            return finalDay;
        },
        //取日期时间差
        getDateRange: function(time1,time2) {
            var date1 = new Date(time1); //2010年12月31日0时0分0秒
            var date2 = new Date(time2); //此时的日期

            var date3 = Math.abs(date1.getTime() - date2.getTime()); //时间差的毫秒数

            //计算出相差天数
            var days = Math.floor(date3 / (24 * 3600 * 1000));
            return days
        }

    }
    Util.ChangeRadio = function(opt) {
        this.radioName = opt.radioName;
        var radio = $('input[name="' + this.radioName + '"]:checked');
        this.radios = $('input[name="' + this.radioName + '"]');
        //当前选中的id 作为key
        this.cur_id = radio.attr('id');
        this.selects = opt.selects;
        //当前选中的radio
        this.init();

    }
    $.extend(Util.ChangeRadio.prototype, {
        init: function() {

            this.loaded();
            this.bind();
        },
        //页面加载的时候初始化
        loaded: function() {
            var me = this;
            $.each(me.radios, function(index, ra) {
                if ($(ra).attr('id') == me.cur_id) {
                    return
                } else {
                    me.disable(ra);

                }

            })
        },
        //设置disable 
        disable: function(ra) {
            var id = $(ra).attr('id');
            var kid = $(ra).attr('id') + '_k';

            $('#' + kid).find('input').attr("disabled", "disabled");
            $('#' + kid).find('input').attr("readonly", "readonly");
            if (this.selects && this.selects[kid]) {
                this.disableSlt(this.selects[kid]);
            }
        },
        disableSlt: function(s) {
            for (var i = 0; i < s.length; i++) {
                s[i].set("disabled", true);
            }
        },
        enableSlt: function(s) {
            for (var i = 0; i < s.length; i++) {
                s[i].set("disabled", false);
            }
        },
        //设置enable
        enable: function(ra) {
            var id = $(ra).attr('id');
            var kid = $(ra).attr('id') + '_k';
            $('#' + kid).find('input').removeAttr("disabled");
            $('#' + kid).find('input').removeAttr("readonly");
            if (this.selects && this.selects[kid]) {
                this.enableSlt(this.selects[kid]);
            }

        },

        //切换方法
        bind: function() {
            var me = this;
            me.radios.on('change', function() {
                me.disable($('#' + me.cur_id), me);
                me.enable($(this));
                me.cur_id = $(this).attr('id');
            })
        }
    })

    $(function() {
        Util.init();
    })

    module.exports = Util;
})
