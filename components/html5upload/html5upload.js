
var Html5Upload = function(opt) {

    this.file = $(opt.file);
    //FILE对象
    this.fileO = '';
    //文件名称
    this.name = '';
    //文件大小
    this.size = 0;
    this.url = opt.url;

    this.progress = opt.progress || function() {}
    this.init();
}

Html5Upload.prototype = {
    // 初始化文件数据
    _initFileData: function(e) {
        var me = this;
        me.fileO = e.target.files;
        me.name = me.fileO[0].name;
        me.size = me.fileO[0].size;



        var data = {
            name: me.name,

            total_size: me.size,
            uploadtype: 1

            // md5 : 
        }
        // me._up();
        $.ajax({
            url: $$C.baseUrl + '/video/getUploadUrl',
            data: data,
            success: function(d) {
                console.log(d)
                me.url = d.data.upload_url;
                me._up();
            },
            dataType: 'json'
        })

    },

    bind: function() {
        this._change();
    },
    // input change事件
    _change: function() {
        var me = this;
        me.file.on('change', function(e) {

            me._initFileData(e);
        })
    },

    _up: function() {
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




        var xhr = new XMLHttpRequest();

        var formData = new FormData();　
        formData.append('name', me.fileO);　


        // xhr.overrideMimeType("application/octet-stream");

        xhr.upload.onprogress = function(e) {

            me.progress(e.loaded, e.total)
        };

        var range = 'bytes ' + (1) + '-' + 999 + '/' + me.size;

        
        // 开始上传
        xhr.open("POST", me.url, true);
        xhr.setRequestHeader("Content-Type", '');
        xhr.setRequestHeader("X_FILENAME", encodeURIComponent(me.name));
        xhr.setRequestHeader("Content-Range", range);


        
        // xhr.sendAsBinary(bindata);
        xhr.send(me.fileO[0].slice(1,1000));
    },
    init: function() {
        this.bind();
    }

}


$('#v_tagsTwo').attr('type','file')


var up = new Html5Upload({
    file: '#v_tagsTwo',
    url: '/',
    progress: function(loaded, total) {


    }

});
