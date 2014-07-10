var express = require('express');
var app = express();
app.use('/html',express.static(__dirname + '/html'));

var server = app.listen(8282, function() {
    console.log('Listening on port %d', server.address().port);
});
