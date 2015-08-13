var Upload = function(opt) {
        opt = $.extend({
            fileBox: opt.fileBox,
            accept: {},
            label: '选择',
            multiple: false, //单文件 多文件
            max: 5, //多文件 最多选几个
            url: opt.url , //配置上传地址 
            fileQueued: function() {

            },
            //检测单次上传最大失败后的回调函数
            checkMax: function(num) {

            },
            //自定义上传字段
            extendData : {},
            /**
             * [progress 上出啊那过程中]
             * @param  {[type]} loaded [已经上传了]
             * @param  {[type]} total  [文件总大小]
             * @param  {[type]} upkey  [文件唯一key]
             * @return {[type]}        [description]
             */
            progress: function(loaded, total, upkey) {

            },
            /**
             * [successItem 多选 每一个文件上传成功]
             * @param  {[type]} json [xmlhttp text]
             * @param  {[type]} upkey  [文件唯一key]
             * @return {[type]}      [description]
             */
            successItem: function(json, upkey) {

            },
            failItem: function(upkey) {

            },
            beforeItemSend : function(key){

            },
            //批量上传中，所有文件上传完成的回调，包括上传失败 
            complete : function(){

            }
        }, opt);
        this.opt = opt;
        this._num = 1; //记录每一个添加file对象的唯一
        this.files = {}; //存放已经选取的数组
        this.failFiles = {}; //批量上传 上传失败的会放在这个对象中
        this.xhr = {}; //存放每个xhr请求
        this._curSelectFiles = []; // 每次次选取文件的flies
        this._init();
    }
    $.extend(Upload.prototype, {
        _init: function() {
            this.initIput(); //初始化 input

        },
        change: function(e) {

            this._curSelectFiles = e.target.files;
            if (!this.opt.multiple) { //单图上传
                this.files = {};
            }
            if (this._checkMax()) {
                this._addToFiles(this._curSelectFiles);
            }
            this._curSelectFiles = [];

        },
        _checkMax: function() {
            if (this.opt.multiple) { //多图

                // if ((this._curSelectFiles.length + this.getFilesLen()) > this.opt.max) {
                // 
                var len = this._curSelectFiles.length;
                if (len > this.opt.max) {
                    this.opt.checkMax(len);
                    return false;

                }
                return true
            } else { //单图
                return true;
            }
        },
        _addToFiles: function(fs) {
            for (var i = 0; i < fs.length; i++) {
                this.files['a_' + this._num] = fs[i];
                this._num++;

            }

            this.opt.fileQueued(fs);

        },
        //触发input onchnage事件 只执行一次
        initIput: function(resetInput) {
            var me = this;
            var opt = this.opt;
            var setLable = function() {
                var label = me.label = $(document.createElement('a'));
                label.addClass('ui-button');
                label.html(opt.label);
                label.on('click', function() {
                    if ($(this).hasClass('ui-button-disabled')) {
                        return
                    }
                    me.input.trigger('click');
                });
                opt.fileBox.append(label);
            }
            var setInput = function() {
                var input = me.input = $(document.createElement('input'));
                input.attr('type', 'file');
                // input.attr('name', 'single_upload_file');
                input.attr({
                    'accept': opt.accept.extensions,
                    'multiple': opt.multiple
                });
                input.bind('change', function(e) {

                    me.change(e);
                    me.initIput('resetInput');
                })
                opt.fileBox.append(input);
                input.css({
                    display: 'none'
                });

            }

            if (!resetInput) {
                setLable();
                setInput();
            } else {
                me.input.remove();
                setInput();
            }
        },
        delFlies: function(key) {
            delete(this.files[key])
        },
        send: function() {
            for (var key in this.files) {
                this._sendFilesItem(key, this.files[key]);
            }
            //添加ui-button-disabled类
            this.label.addClass('ui-button-disabled');
            //this.label.val('上传中');
        },
        abortCallback: function(key) {
            this.xhr[key].abort();
            this.delFlies(key);
            if(this.getFilesLen() === 0){
                this.label.removeClass('ui-button-disabled');
                this.label.text(this.opt.label);
            }

        },
        _successItem: function(json, key) {
            
            this.opt.successItem(json, key);
            this.delFlies(key);
            
        },
        _failItem: function(key) {
            
            this.opt.failItem(key);
            this.failFiles[key] = this.files[key];
            this.delFlies(key);
            // this._complete();
        },
        _complete : function(){
           
            
            
        },
        _sendFilesItem: function(key, file) {
            var me = this;
            me.opt.beforeItemSend(key);
            this.xhr[key] = new XMLHttpRequest();
            this.xhr[key].upload.onprogress = function(e) {
                me.label.text('上传中...');
                me.opt.progress(e.loaded, e.total, key);
            };

            this.xhr[key].onreadystatechange = function() {
                // me.label.removeClass('ui-button-disabled');
                if (me.xhr[key].readyState == 4 && me.xhr[key].status == 200) {
                    var json = JSON.parse(me.xhr[key].responseText);
                    me.label.text(me.opt.label);
                    me._successItem(json, key);
                    // /json2
                } else{
                    // me._failItem(key);
                }
            };
            formData = new FormData();
            var D = me.opt.extendData;
            for(var k in D){
                formData.append(k, D[k]);
            }
            formData.append('filename', file);
            // 开始上传
            this.xhr[key].open("POST", me.opt.url, true);
            // xhr.sendAsBinary(bindata);

            this.xhr[key].send(formData);
        }

    });