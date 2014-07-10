
(function() {
    var v = "201403011320";
    var debug = 1;
    seajs.config({
        base: $$c.staticUrl + "/sea-modules/",
        alias: {
            //jquery
            "$": "jquery/jquery/1.10.1/jquery.js",
            "$-debug": "jquery/jquery/1.10.1/jquery.js",
            "jquery": "jquery/jquery/1.10.1/jquery.js",
            //custom
            "util": "custom/util/util.js",
            "textLimit": "custom/textlimit/textlimit.js",
            "setAnchor": "custom/setanchor/setanchor.js",
            "uploadify": "custom/uploadify/3.2.1/uploadify.js",
            "swf": "custom/uploadify/3.2.1/uploadify.swf",
            "highcharts": "custom/highcharts/highcharts.js",
            "insertText": "custom/insertText/insertText.js",

            
            "calendar_css": "arale/calendar/1.0.0/calendar.css",
            "validator": 'arale/validator/0.9.7/validator.js',
            "calendar": "arale/calendar/1.0.0/calendar.js",
            "widget": "arale/widget/1.1.1/widget.js",
            "select": "arale/select/0.9.9/select",
            "dialog": "arale/dialog/1.2.5/dialog.js",
            "tip": "arale/tip/1.2.1/tip.js",
            // "tab": "arale/switchable/1.0.2/tabs.js",
            "autocomplete": "arale/autocomplete/1.3.0/autocomplete.js",

            "confirmbox": "arale/dialog/1.2.5/confirmbox.js",
            "_": "gallery/underscore/1.5.2/underscore",
            "placeholders": "gallery/placeholders/3.0.1/placeholders.js"
        },
        map: [

            function(uri) {
                if (!/\-debug\.(js|css)+/g.test(uri) && (debug==1)) {
                    uri = uri.replace(/\/(.*)\.(js|css)/g, "/$1-debug.$2" + "?v=" + v);
                } else if (/^(.*\.(?:css|js))(.*)$/gi.test(uri)) {
                     if (debug==1) {
                    uri = uri.replace(/^(.*\.(?:css|js))(.*)$/i, '$1?v=' + v);
                     }
                }
                return uri
            }
        ],
        // 文件编码
        charset: 'utf-8'
    });
})();

