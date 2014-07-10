//以router为力来说明
var express = require('express');
var app = express();
var ejs = require('ejs');
var router = express.Router();
var data = require('../../config.js').configData;
var rootUrl = require('../../config.js').rootUrl;

var util = require('../util/util.js').util;

//跑一遍view目录下的目录结构 得到util.GuideData
util.uwalk('./_m/view/', {
    type: 'dir'
});
console.log(util.GuideData)
//util.GuideData
router.use(function(req, res, next) {
    var query = req.query;
    var level1 = query.level1;
    var level2 = query.level2;

    if (/\/tool\//.test(req.url)) {
        var svn = require("svn-interface");
        var option = {
            "username": "heliang",
            "password": "heliang123"
        }
        svn.update("../", option, function up(e, r) {
            console.log(r)
           
            res.send(r)
        })
        
        return
    }

    if (!level2 || !level1) { //res.send('参数没有level1或者level2');


        if (/\.css|\.js/g.test(req.originalUrl)) { //表示是js文件结尾的 或者css文件结尾的
            res.status(404);
            res.send({
                error: 'Not found'
            });
            return
        }
        res.render('index.ejs', {
            data: util.GuideData
        }, function(err, html) {
            res.send(ejs.render(html))
        });
        return;
    }
    var routerQ = level1 + '/' + level2 + '.ejs';
    console.log(data[level1].name)
    var mydata = {
        catname: data[level1].name,
        catClass: level1, //页面body的频道class
        pageClass: level2, //页面body的页面class
        pageData: data[level1]['cat2'][level2],
        rootUrl: rootUrl
    }

    res.render(routerQ, {
        data: mydata
    }, function(err, html) {
        res.send(ejs.render(html))

    });
    //next();
});
exports.router = router;
