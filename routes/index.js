var express = require('express');
var request = require('request-promise');
var session = require('express-session');
var router = express.Router();

const title = 'GVT Cementos';
var circulocorp = process.env.CIRCULOCORP
var baseurl = process.env.URL




/* GET home page. */
router.get('/', function(req, res, next) {
	//if (req.session.user && req.cookies.user_sid) {
  		res.render('index');
   /* }else{
    	res.redirect('/login')
    }*/
});

router.get('/login', function(req, res, next) {
	if (req.session.user && req.cookies.user_sid) {
  		res.redirect('./');
    }else{
    	res.render('login');
    }
});

router.get('/logout', function(req, res, next) {
   req.session.destroy();
   req.clearCookie('user_sid'); 
   res.render('login');
});

module.exports = router;