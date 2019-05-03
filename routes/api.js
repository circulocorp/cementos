var express = require('express');
var request = require('request-promise');
var session = require('express-session');

var router = express.Router();
var API_URL = process.env.API_URL || "http://localhost:8080/api";

router.post('/events', function(req, res, next){
	var url = API_URL+'/canevents/report';
	var data = req.body;
	var options = {
   		uri: url,
   		json: true,
   		method: 'GET',
   		qs: data

	};
	request(options, (err, re, body) => {
		console.log(body);
		res.send(body);
	});
});


router.post('/login', function(req, res, next){
	var mzone = 'https://login.mzoneweb.net/connect/token';
	var user = req.body.user;
	var password = req.body.password;
	var data = {'grant_type': 'password', 'username': user, 'password': password, 'client_id': '', 
	'client_secret': '', 'scope': 'openid mz6-api.all mz_username'}
	var options = {
		headers: {
			'Accept': 'application/json',
      		'Content-Type': 'application/x-www-form-urlencoded'
    	},
		uri: mzone,
		json: true,
		method: 'POST',
		form: data
	};
	request(options, (err, re, body) => {
		if (re.statusCode == 200) {
			var resp = {"user": user, "token": body.access_token};
			req.session.user = resp.user;
			req.session.token = resp.token;
			res.send(resp);
		} else {
			res.send({});
		}
	});


});

module.exports = router;