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
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

app.use(session({
  key: 'user_sid',
  cookie: { maxAge: 3000 },
  secret: 'TelcelGVT',
  saveUninitialized: false,
  resave: false
}));


app.use('/', indexRouter);
app.use('/api/', api);
app.use(function(req, res, next){
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});


module.exports = app;