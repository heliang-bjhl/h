var fs = require("fs"),
    _ = require("underscore"),
    config = require("../package.json"),
    routes = require("./config").routes;
couponsList = require("../models/padmin_coupons_list_data.js")
var staticUrl;
if(config.debug){
    staticUrl = config.staticUrl;
}else{
    staticUrl = config.staticUrl + '/release';
}



var data = {
    staticUrl: staticUrl,
    debug: config.debug,
    plat: "平台后台"
};


for (var i in routes.padmin) {

    (function(j) {
        var cat = routes.padmin[j]['data'];
        for (var k in cat) {
            // console.log(v)
            var vv = cat[k];
            (function(v) {
                exports[k] = function(req, res) {

                    var o = {
                        title: v.level2

                    }
                    if (v.ext) {
                        for (var p in v.ext) {
                            o[p] = v.ext[p];
                        }
                    }
                    // console.log(o)
                    res.render(v.view, _.extend(data, o));
                };
            })(vv)
        }
    })(i)
}