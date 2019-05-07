var express = require('express');
var request = require('request-promise');
var session = require('express-session');
var secrets = require('docker-secrets-nodejs');
var router = express.Router();
var API_URL = process.env.API_URL || "http://localhost:8080/api";

router.post('/events', function(req, res, next){
	if(req.session.user && req.session.token){
	var url = API_URL+'/canevents/report';
	var data = req.body;
	var options = {
   		uri: url,
   		json: true,
   		method: 'GET',
   		qs: data

	};
	request(options, (err, re, body) => {
		res.status(200).send(body);
	});
	}else{
		res.status(403).send({"error": "Unauthorized"});
	}
});


router.post('/login', function(req, res, next){
	var mzone = 'https://login.mzoneweb.net/connect/token';
	var user = req.body.user;
	var password = req.body.password;
	var mzone_secret = "WJ4wUJo79qFsMm4T9Rj7dKw4";//secrets.get("mzone_secret");
	var data = {'grant_type': 'password', 'username': user, 'password': password, 'client_id': 'mz-a3tek', 
	'client_secret': mzone_secret, 'scope': 'openid mz6-api.all mz_username'}
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
			var options2 = {
		   		uri: API_URL+'/canusers?username='+user,
		   		json: true,
		   		method: 'GET'
			};
			request(options2, (err, re2, body2) => {
				var canuser = body2[0];
				if(canuser && canuser.isActive){
					req.session.user = resp.user;
					req.session.token = resp.token;
					res.status(200).send(resp);
			    }else{
					res.status(403).send({error: "Not authorized"});    	
			    }
			});
		} else {
			res.status(403).send({error: err});
		}
	});


});

module.exports = router;