var express = require('express');
var app = express();
var path = require('path');
app.use('/', express.static(path.join(__dirname, '')));

// respond
app.use(function(req, res, next){
  res.send('Hello World');
});

app.listen(3300);
