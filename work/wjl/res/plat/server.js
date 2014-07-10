/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var _ = require("underscore");
var routeConfig = require("./routes/config").routes;
var padmin = require("./routes/padmin");
var badmin = require("./routes/badmin");
var http = require('http');
var path = require('path');
var expressLess = require('express-less')
var app = express();

// all environments
app.set('port', process.env.PORT || 18080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use('/static', express.static(path.join(__dirname, 'static')));
app.use('/sea-modules', express.static(__dirname + '/sea-modules'));
app.use('/release', express.static(__dirname + '/release'));
app.use('/static/css', expressLess(__dirname + '/static/css', {
    compress: false,
    relativeUrls: true
}));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
//console.log(process.env.NODE_ENV);

app.get('/', routes.index);
app.get('/style_guide', routes.styleGuide);
app.post('/upload', routes.upload);
app.post('/post_data', routes.postData);
app.get('/json', routes.json);
//badmin 路由

for (var cat in routeConfig.badmin) {
    _.each(routeConfig.badmin[cat].data, function(item, k) {
        app.get(item.url, badmin[k]);
    })
}

// padmin路由
for (var cat in routeConfig.padmin) {
    _.each(routeConfig.padmin[cat].data, function(item, k) {
        app.get(item.url, padmin[k]);
    })
}





http.createServer(app).listen(app.get('port'), function() {
    console.log('访问 http://localhost:' + app.get('port'));
    console.log("ctrl + c 停止服务器");
});