var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var ejs = require('ejs'); 
var bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var api = require('./routes/api');

var app = express();
app.set("view options", {layout: true}); 
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.json());
app.use(session({
  secret: 'TelcelGVTcementos',
  saveUninitialized: false,
  resave: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(cookieParser());




app.use('/', indexRouter);
app.use('/api/', api);
app.use(function(req, res, next){
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});


module.exports = app;