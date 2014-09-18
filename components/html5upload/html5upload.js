var Html5Upload = function(opt) {

    this.fileBox = $(opt.fileBox);
    //FILE对象
    this.fileO = '';
    //文件名称
    this.name = '';
    //文件大小
    this.size = 0;
    //posturl
    this.url = opt.url;
    // 记录续传timer 续传获取token失败之后 重拾3次 如果token还没有则提示获取token失败 重新上传
    this._continueTokenTimer = null;
    //记录获取续传token的次数 3次提示失败
    this._continueGetToken = 0;
    //表示是否续传
    this.ContinueUpload = 0;

    // 已经传了多少 主要用于 分片loaded的累加
    this.loaded = 0;
    this.curLoad = 0;
    //本地存储的key
    this.localKey = '';
    // 总数
    this.total_size = 0;

    //默认从0开始传
    this.curChunkNum = 0;
     this.tokenUrl = $$C.baseUrl + '/video/getUploadUrl';

    this.vid = null;


    this.accept = 'video/*';
    // 默认分块
    this.ischunk = true;
    this.chunks = [];
    this.chunkSize = 2 * 1024 * 1024;




    // 过程中
    this.progress = opt.progress || function() {}
    // 选择文件后
    this.fileQueued = opt.fileQueued || function() {}
    // 第一次收到响应
    this.loadstart = opt.loadstart || function() {};
    // send之前
    this.beforeSend = opt.beforeSend || function() {};
    // 传完数据并返回200
    this.success = opt.success || function() {}
    //每一片数据传输成功
    this.chunkSuccess = opt.chunkSuccess || function() {};

    //开始续传
    this.startContinueUpload = opt.startContinueUpload || function() {};
    // 续传之前
    this.beforeContinueUpload = opt.beforeContinueUpload || function() {}



    //continueUploadErr目前用于token获取失败的时候
    this.continueUploadErr = opt.continueUploadErr || function() {};

    this.init();
}

Html5Upload.prototype = {
    _resetOption: function() {
        this.tokenUrl = $$C.baseUrl + '/video/getUploadUrl';
        // 已经传了多少 主要用于 分片loaded的累加
        this.loaded = 0;
        this.curLoad = 0;
        //本地存储的key
        this.localKey = '';
        // 总数
        this.total_size = 0;

        //默认从0开始传
        this.curChunkNum = 0;

        // 默认分块
        this.ischunk = true;
        this.chunks = [];
        this.chunkSize = 2 * 1024 * 1024;
    },
    _continueUploadErr: function() {
        this._resetOption();
        this.continueUploadErr();
    },
    checkLocal: function(file) {
        var me = this;
        me.localKey = file['name'] + '_' + file['size'];

        if (localStorage[me.localKey]) {
            var n = parseInt(localStorage[me.localKey].split('|')[0]);
            this.curChunkNum = n + 1;
            this.loaded = this.chunkSize * this.curChunkNum;
            this.beforeContinueUpload(this.loaded, file['size']);
            this.vid = localStorage[me.localKey].split('|')[1];
            this.tokenUrl = $$C.baseUrl + '/video/getResumeUploadUrl/' + this.vid ;
            //设置当前状态为续传
            this.ContinueUpload = 1;
        } else {
            return false;
        }
    },
    // 初始化文件数据
    _initFileData: function(e) {
        var me = this;
        me.fileO = e.target.files;


        me.fileModifyDate = new Date(me.fileO[0].lastModifiedDate).getTime();
        me.name = me.fileO[0].name;
        me.size = me.fileO[0].size;
        me.total_size = me.size;
        me.fileQueued();
        me._setChunks(me.size); //设置分段
        // 上传乐视视频前需要先取token
        me.checkLocal(me.fileO[0])


        me._getToken({
            name: me.name,
            total_size: me.size,
            uploadtype: 1
        });
    },

    //取密钥接口
    _getToken: function(data) {
        var me = this;
        // me._up();
        $.ajax({
            url: me.tokenUrl,
            data: data,
            type: 'post',
            success: function(d) {
                if (d.code === 0) {
                    me.url = d.data.upload_url;
                    me.vid = d.data.id;
                    if (me.ContinueUpload) {
                        me.startContinueUpload();
                    }
                    me._send();
                } else {
                    if (me._continueGetToken == 3) {
                        clearTimeout(me._continueTokenTimer);
                        localStorage.removeItem(me.localKey);

                        me._continueUploadErr()
                        return
                    }
                    //等待10秒 再发请求
                    me._continueTokenTimer = setTimeout(function() {
                        me._continueGetToken++;
                        me._getToken(data);
                    }, 10000)


                }

            },
            dataType: 'json'
        })
    },

    // 设置分段
    _setChunks: function(size) {

        var n = parseInt(size / this.chunkSize);
        for (var i = 0; i < n; i++) {
            var start = this.chunkSize * i + 1;
            var end = this.chunkSize * (i + 1);
            this.chunks.push({
                start: start,
                end: end
            });
        }
        if (size % this.chunkSize == 0) { //整除表示可以平均分

        } else {
            var start = this.chunkSize * n + 1;
            var end = size;
            this.chunks.push({
                start: start,
                end: end
            });
        }

    },

    bind: function() {
        this._change();
    },
    // input change事件
    _change: function() {
        var me = this;
        me.input.on('change', function(e) {

            me._initFileData(e);
        })
    },

    _up: function(start, end) {
        var me = this;
        // try {
        //     if (XMLHttpRequest.prototype.sendAsBinary) return;
        //     XMLHttpRequest.prototype.sendAsBinary = function(datastr) {
        //         function byteValue(x) {
        //             return x.charCodeAt(0) & 0xff;
        //         }
        //         var ords = Array.prototype.map.call(datastr, byteValue);
        //         var ui8a = new Uint8Array(ords);
        //         this.send(ui8a.buffer);
        //     }
        // } catch (e) {}




        this.xhr = new XMLHttpRequest();

        // xhr.overrideMimeType("application/octet-stream");
        var chunkLoaded = 0;
        this.xhr.upload.onprogress = function(e) {

            var hasLoad = me.loaded;
            me.curLoad = hasLoad + e.loaded;
            chunkLoaded = e.total;
            me.progress(me.curLoad, me.total_size);
        };

        this.xhr.onreadystatechange = function() {
            if (me.xhr.readyState == 4 && me.xhr.status == 200) {

                var len = me.chunks.length;
                if (me.curChunkNum == len - 1) {


                } else {
                    me.chunkSuccess(me.curChunkNum);
                }

                me.curChunkNum++;
                me._chunkSuc(chunkLoaded);

            }

        }

        var range = 'bytes ' + start + '-' + end + '/' + me.size;


        // 开始上传
        this.xhr.open("POST", me.url, true);
        this.xhr.setRequestHeader("Content-Type", '');
        this.xhr.setRequestHeader("X_FILENAME", encodeURIComponent(me.name));
        this.xhr.setRequestHeader("Content-Range", range);


        // for(var )
        // xhr.sendAsBinary(bindata);
        this.xhr.send(this.fileO[0].slice(start - 1, end))
    },
    abort: function() {
        this.xhr.abort()
    },
    _chunkSuc: function(chunkLoaded) {
        this.loaded = this.loaded + chunkLoaded;

        this._send();
    },

    _send: function(xhr) {


        var len = this.chunks.length;

        //最后一片上传完毕

        if (this.curChunkNum == len) {
            this._suc();
            return
        }
        if (this.beforeSend) {
            this.beforeSend(this.fileO[0]);
        }
        var chunk = this.chunks[this.curChunkNum];
        this._up(chunk['start'], chunk['end']);

    },
    _suc: function() {
        this.success()
    },
    initIput: function() {
        // var input = '<input type="file"  name="" id="filehtml" value="" accept="'+this.accept+'"  />';

        var label = this.label = $(document.createElement('label'));
        var input = this.input = $(document.createElement('input'));
        input.attr('accept',this.accept);

        label.html('点击上传')
        input.attr('type', 'file');
        label.on('click', function() {

            input.trigger('click');
        });
        this.fileBox.append(input);
        this.fileBox.append(label);
    },


    // init
    init: function() {
        this.initIput();
        this.bind();
    }

}

var FlashUpload = function(opt) {

    this.fileBox = $(opt.fileBox);
    this.url = opt.url;
    this.swf = opt.swf;
    this.flashId = opt.flashId;
    // 总数
    this.total_size = 0;

    this.tokenUrl = $$C.baseUrl + '/video/getUploadUrl';

    this.vid = null;

    this.accept = 'video/*';

    // 过程中
    this.onprogress = opt.onprogress || function() {}

    // 第一次收到响应
    this.loadstart = opt.loadstart || function() {};
    // send之前
    this.beforeSend = opt.beforeSend || function() {};
    // 传完数据并返回200
    this.success = opt.success || function() {}

    this.init();
}
FlashUpload.prototype = {
    //取密钥接口
    _getToken: function(data, callback) {
        var me = this;
        // me._up();
        $.ajax({
            url: me.tokenUrl,
            data: data,
            type: 'post',
            success: function(d) {
                callback(d);
            },
            dataType: 'json'
        })
    },
    fileQueued: function(size,name) {

        var me = this;
        this._getToken({
            name: name,
            total_size: size
        }, function(d) {
            if (d.code === 0) {
                //调用flash的sendUrl 方法
                me.beforeSend({size:size});
                myupload.sendUrl(d.data.upload_url);
            }
        })
    },
    //文件上传过程中
    uploadprogress: function(loaded, totalSize) {

        this.onprogress(loaded, totalSize);
    },
    uploadcomplete: function() {

    },
    // 检测文件状态
    fileuploadstatus: function(code,data) {

        // console.log(data)
       var json = $.parseJSON(data);
       if(data && json.code === 0){
            this.success();
       }
    },


    initIput: function() {
        // var input = '<input type="file"  name="" id="filehtml" value="" accept="'+this.accept+'"  />';

        var label = this.label = $(document.createElement('label'));
        label.html('点击上传')

        var flashHtml = ''
            // insert flash object
        flashHtml = '<div class="myflash"><object id="' + this.flashId + '" type="application/' +
            'x-shockwave-flash" data="' + this.swf + '" ';

        // flashHtml += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" ';

        flashHtml += 'width="100%" height="100%" style="outline:0">' +
            '<param name="movie" value="' + this.swf + '" />' +
            '<param name="flashvars" value="up">' +
            '<param name="wmode" value="transparent" />' +
            '<param name="allowscriptaccess" value="always" />' +
            '</object></div>';
        this.fileBox.append(label);
        this.fileBox.append(flashHtml);
    },


    // init
    init: function() {
        this.initIput();

    }

}
