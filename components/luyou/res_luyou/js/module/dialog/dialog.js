define(LEC.seaConfig.alias.dialog, function(require, exports, module) {
    var dot = require('dot');
    var Dialog = function(opts) {
        var opt = {
            isButton: true,
            width: 300,
            height : 'auto',
            confirmFun: function() {},
            closeFun: function() {},
            afterOpen: function() {},
            beforeShow : function(){},
            content: '',
            model: 'remove' //hide 表示隐藏 remove 表示删除
        }
        $.extend(opt, opts);
        opt.marginLefts = -opt.width / 2;
        $Le.BassClass.call(this);
        this.opt = opt;
        this.opt.guid = this.guid;

        this.isButton = opt.isButton || true;
        this.tpl = [
            '<div class="ui-dialog-mask" id="j_dialog_mask_{{=it.guid}}"></div>',
            '<div class="ui-dialog" id="j_dialog_{{=it.guid}}" style="width:{{=it.width}}px;margin-left:{{=it.marginLefts}}px">',
            '<div class="ui-dialog-head"><p>{{=it.title}}</p><i data-dialog-op="close" class="j_op"></i></div>',
            '<div class="ui-dialog-content" style="height:{{=it.height}}px;">',
            this.opt.content,
            '</div>',
            '{{? it.isButton }}',
            '<div class="ui-dialog-footer">',
            '<div class="rel"><input type="button" class="ui-button j_op" value="确定" data-dialog-op="confirm" /></div>',
            '<input type="button" class="ui-button j_op" value="取消" data-dialog-op="cancel" />',
            '</div>',
            '{{?}}',
            '</div>'
        ].join('');
        this._init();
    }
    $Le.extend(Dialog, $Le.BassClass);
    $.extend(Dialog.prototype, {
        _init: function() {
            // this.bind();
        },
        bind: function() {
            var me = this;
            $('#j_dialog_' + this.guid).on('click', '[data-dialog-op]', function() {
                //防重复
                //
                //
                
                if ($(this).hasClass('ui-button-disabled')) {
                    return
                }
                var opt = $(this).data('dialog-op');

                me[opt]($(this));
            })

            //扩展事件
            $('#j_dialog_' + this.guid).on('click', '[data-user-op]', function() {
                //防重复
                //
                //
                var user = $(this).data('user-op');
                
                me.opt[user]($(this));
            })
        },
        resetHeight: function() {
            var dialog = $('#j_dialog_' + this.guid);
            var h = dialog.height();
            var mt = -h / 2;
            dialog.css({
                'margin-top': mt
            })
        },
        _setHeight: function() {
            var dialog = $('#j_dialog_' + this.guid);
            var h = dialog.height();

            var mt = -h / 2;
            dialog.animate({
                'margin-top': mt
            }, 100)
        },
        setContent: function(content) {
            var dialog = $('#j_dialog_' + this.guid);
            dialog.find('.ui-dialog-content').html(content)
        },
        open: function() {

            var dialogHtml = $le.tplRender(dot, this.tpl, this.opt);
            alert(dialogHtml)
            $('body').append(dialogHtml);
            this._bindEsc();
            this.bind();
            this._setHeight();
            this.opt.afterOpen();
        },

        append: function() {
            var dialogHtml = $le.tplRender(dot, this.tpl, this.opt);
            $('body').append(dialogHtml);
            this._setHeight();
            this.bind();
            this.close();

        },
        show: function() {
            this.beforeShow();
            try {
                this._bindEsc();
            } catch (e) {}
            $('#j_dialog_mask_' + this.guid).show();
            $('#j_dialog_' + this.guid).show();
        },
        //esc start
        _escEvent: function(e) {
            var me = e.data.me;
            if (e.keyCode == 27) {
                me.close();
            }
        },

        _bindEsc: function() {
            var me = this;
            $(document).bind('keyup', {
                me: me
            }, me._escEvent);
        },
        _offBindEsc: function() {
            var me = this;
            $(document).unbind("keyup", me._escEvent);
        },
        //esc end
        //
        //操作 start
        close: function() {
            if (this.opt.model === 'hide') {
                $('#j_dialog_mask_' + this.guid).hide();
                $('#j_dialog_' + this.guid).hide();

            } else {
                $('#j_dialog_mask_' + this.guid).remove();
                $('#j_dialog_' + this.guid).remove();
            }

            this._offBindEsc();
            this.opt.closeFun();
        },
        hide : function(){
            $('#j_dialog_mask_' + this.guid).hide();
                $('#j_dialog_' + this.guid).hide();
        },
        cancel: function() {

            this.close();
        },
        confirm: function(button) {

            this.opt.confirmFun(this, button);
        },
        beforeShow : function(){
            this.opt.beforeShow(this)
        }
    })

    module.exports = Dialog;
})
