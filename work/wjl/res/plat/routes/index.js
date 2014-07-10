/*
 * GET home page.
 */
var _ = require('underscore')._;
var fs = require('fs');
var path = require('path');
var format = require('util').format;
var config = require("../package.json");
var routes = require("./config").routes;

var root = path.resolve(__dirname, "..");

var data = {
    staticUrl: config.staticUrl,
    debug: config.debug,

}



exports.index = function(req, res) {
    var svn = require("svn-interface");
    var option = {
        "username": "heliang",
        "password": "heliang123"
    }
    svn.update("../plat/static/", option, function up(e, r) {
        console.log(r + 'aaaaa')
        console.log(e)
    })
    
    res.render('index', _.extend(data, {
        title: '首页',
        badmin: routes.badmin,
        padmin: routes.padmin
    }));

};
exports.postData = function(req, res) {
    // var json = {
    //     code: 200, //200正常
    //     data: req.body
    // };
    var json = {
        code: 400, //200正常
        msg: "用户名不正确",
        data: req.body
    };

    res.json(json);
};
exports.styleGuide = function(req, res) {
    res.render('style_guide', {
        title: '样式引导页面，通用组件'
    });
};


exports.json = function(req, res) {
    res.type("html");
    res.json({
        url: "http://d.hiphotos.baidu.com/image/w%3D2048/sign=c4734d1540a7d933bfa8e3739973d013/8718367adab44aede5b3c9e5b11c8701a18bfb36.jpg"
    })
}
exports.upload = function(req, res) {

    res.type("html");
    var imgs = req.files.file,
        json = {
            url: []
        };
    if (!Array.isArray(imgs)) { //单个图片
        imgs = [].concat(imgs)
    }
    _.each(imgs, function(item, index) {
        var newPath = root + "/static/uploads/" + item.name;
        fs.rename(item.path, newPath, function(err) {
            if (!err) {
                json.url.push(path.relative(root, newPath));
                if (index == imgs.length - 1) {
                    res.json(200, json);
                }
            }
        })
    })

}
