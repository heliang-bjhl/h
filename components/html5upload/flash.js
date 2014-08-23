
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
