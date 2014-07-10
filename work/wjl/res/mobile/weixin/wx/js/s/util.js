// 所有模块都通过 define 来定义
define(function(require, exports, module) {

    var util = {
        //取事件
        getEvent: function() {
            // IE
            if (document.all) {
                return window.event;
            }
            func = util.getEvent.caller; // 返回调用本函数的函数
            while (func != null) {
                var arg0 = func.arguments[0];
                if (arg0) {
                    if ((arg0.constructor == Event || arg0.constructor == MouseEvent) || (typeof(arg0) == "object" && arg0.preventDefault && arg0.stopPropagation)) {
                        return arg0;
                    }
                }
                func = func.caller;
            }
            return null;
        },

        // 表单提交
        form: {
            sb: function(op) {
                var form = $('#' + op.form);
                var sb = $('#' + op.sb);
                this._bindInput(form);
                this._bindButton(op, form);
            },
            _bindButton: function(op, form) {
                var me = this;
                var sb = $('#' + op.sb);
                sb.attr('type', 'submit');
                sb.bind(util.click, function() {
                    if (me._checkvAll(form)) {
                        if (op.extendVal) {
                            op.extendVal(form);
                        } else {
                            form.submit();
                        }
                        return false
                    } else {
                        return false;
                    }

                })
            },
            _bindInput: function(form) {
                var me = this;

                form.on('blur', 'input', function() {
                    if ($(this).data('v')) {
                        me._setErrOrSuc($(this))
                    }

                });
                form.on('change', 'select', function() {
                    if ($(this).data('v')) {
                        me._setErrOrSuc($(this))
                    }

                });

            },
            _setErrOrSuc: function(el) {
                var me = this;

                var cur_v = me._checkv(el); //当前没有通过的验证  true 表示全通过 
                if (cur_v === true) {
                    me.setSuc(el);
                    return 1;
                } else {
                    var err = el.data('err'); // 参数为2级验证
                    me.setErr(el, err);
                    return 0;
                }
            },
            setErr: function(el, html) {
                el.parent().find('.m-err').show().html(html);
            },
            setSuc: function(el) {
                el.parent().find('.m-err').hide();
            },
            _checkv: function(el) {
                var vvv = el.data('v');

                v = vvv.split('-');
                var me = this;
                for (var i = 0; i < v.length; i++) {
                    var itemv = v[i].split('|')[0];
                    var level2V = v[i].split('|')[1];
                    if (util.val[itemv]) { //有验证 通过
                        if (util.val[itemv](el, level2V)) {

                        } else {
                            return v[i]
                        }
                    }

                }
                return true
            },
            _checkvAll: function(form) {
                var me = this;
                var r = true;
                $.each(form.find('[data-v]'), function() {

                    if (me._setErrOrSuc($(this))) {

                    } else {
                        r = false;
                    }
                })
                return r;
            },
            //制定验证规则
            val: function(arr, callback) {
                var me = this;
                var callback = callback || function() {};
                for (var i = 0; i < arr.length; i++) {
                    if (me._setErrOrSuc($('#' + arr[i]))) {
                        callback()
                    }
                }
            }
        },
        goTop : function(){
            $.scrollTo({
                endY: 0,
                duration: 200,
                callback: function() {
                 
                }
              });
        }
    };
    util.device = (/android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(navigator.userAgent.toLowerCase()))
    util.click = util.device ? 'touchend' : 'click';
    util.mousedown = util.device ? 'touchstart' : 'mousedown';
    util.mouseup = util.device ? 'touchend' : 'mouseup';
    util.scroll = util.device ? 'touchmove' : 'scroll';

    // util.valTip = {
    //     require : function(){
    //         return '此处为必填写';
    //     },
    //     phone : function(){
    //         return '请输入正确的手机号码';
    //     },
    //     range : function(){
    //         return 1
    //     }
    // }
    util.val = {
        require: function(el) {
            var vv = $.trim(el.val())
            if (vv === '') {
                util.val._setErr(el, '此处为必填')
                return false;
            } else {

                return true
            }
        },
        phone: function(el) {
            var vv = $.trim(el.val())
            var reg = /^0?(13[0-9]|15[012356789]|18[012356789]|14[57])[0-9]{8}$/;
            if (reg.test(vv)) {
                return true;
            } else {
                util.val._setErr(el, '请输入正确的手机号')
                return false
            }
        },
        range: function(el, level2V) {

            var min = parseInt(level2V.split('_')[0]);
            var max = parseInt(level2V.split('_')[1]);
            var len = el.val().length;
            if (len >= min && len <= max) {
                return true;
            } else {
                util.val._setErr(el, '请输入' + min + '－' + max + '个字符，数字或字母组合');
                return false
            }
        },
        date : function(el){
            var vv = $.trim(el.val());
            var reg = /^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}$/;
            if (reg.test(vv)) {
                return true;
            } else {
                util.val._setErr(el, '请输入正确的日期 格式为xxxx-xx-xx ')
                return false
            }
        },
        _setErr: function(el, err) {
            el.data('err', err)
        }
    }

    util.Go = function(ajaxOpt, op) {
        this.ajaxOpt = ajaxOpt;
        if (op) {
            this.bind(op);
        }else{
            this.ajax = $.ajax(ajaxOpt);
        }
    }
    $.extend(util.Go.prototype, {
        abort: function() {
            this.ajax.abort()
        },
        bind: function(op) {

            var me = this;
            var trigger = op.trigger;
            var greyClass = op.greyClass;
            var loadingMsg = op.loadingMsg;

            $('#' + trigger).bind(util.mousedown, function() {

                var ipt = $(this);
               
                if (ipt.hasClass(greyClass)) {
                    return
                }else{
                    me.ajax = $.ajax(me.ajaxOpt)
                }


            })
        }
    })
    //下拉菜单
    util.DropDown = function(op) {
        this.triggerId = op.trigger;
        this.dropBoxId = op.dropBox;
        this.trigger = $('#' + this.triggerId);
        this.dropBox = $('#' + this.dropBoxId);
        this.selectCall = op.selectCall || function() {};
        this.init();
    }
    $.extend(util.DropDown.prototype, {
        init: function() {
            this.bind();
        },
        bind: function() {
            var me = this;
            me.trigger.bind(util.click, function(e) {
                me._show();
            });
            // me.dropBox.on(util.click, 'a', function() {
            //     me.selectCall($(this));
            //     me._close();
            // })

        },
        _bindBodyFun: function(ev) {
            var me = ev.data.me;
            var e = util.getEvent();
            var ee = e.srcElement || e.target;
            while (ee) {
                if ($(ee).attr('id') == me.triggerId) {
                    return;
                }
                if ($(ee).attr('id') == me.dropBoxId) {

                    return;
                }
                if (ee == document.body) {
                    me._clickBody();

                    return;
                }
                ee = ee.parentNode;
            }

        },

        _show: function() {
            var me = this;
            me.dropBox.show();
            me.bindBody();

        },
        _close: function() {
            var me = this;
            this.dropBox.hide();
            me.unbindBody()
        },
        _clickBody: function() {
            this._close();
        },
        bindBody: function() {

            var me = this;

            $(document).bind(util.mousedown, {
                me: me
            }, me._bindBodyFun);

        },
        unbindBody: function() {

            var me = this;
            $(document).unbind(util.mousedown, me._bindBodyFun)
        }
    })
    // 或者通过 module.exports 提供整个接口
    module.exports = util;

});
