var express = require('express');
var app = express();
app.set('views', __dirname + '/_m/view/'); //设置模版目录
app.set('view engine', 'ejs'); //设置模版引擎为ejs
var router = require('./_m/routes/routes.js').router; 
var path = require('path');
var expressLess = require('express-less');
app.use('/wx/css', expressLess(__dirname + '/wx/css', {
    compress: false,
    relativeUrls: true
}));
app.use('/wx', express.static(path.join(__dirname, 'wx')));
app.use('/tool', express.static(path.join(__dirname, 'tool')));
app.use('/release', express.static(path.join(__dirname, 'release')));
app.use('/', router);


app.listen(8181);