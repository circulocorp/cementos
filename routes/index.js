var express = require('express');
var request = require('request-promise');
var session = require('express-session');
var router = express.Router();

const title = 'GVT Cementos';
var circulocorp = process.env.CIRCULOCORP
var baseurl = process.env.URL


/* GET home page. */
router.get('/', function(req, res, next) {
	if (req.session.user) {
  		res.status("200").render('index', {username: req.session.user});
   }else{
    	res.status(403).redirect('/login');
  }   
});

router.get('/login', function(req, res, next) {
	if (req.session.user && req.session.token) {
  		res.status(200).redirect('./');
    }else{
    	res.status(403).render('./login');
    }
});

router.get('/logout', function(req, res, next) {
   req.session.destroy();
   req.clearCookie('user_sid'); 
   res.render('login');
});

module.exports = router;