var express = require('express');
var request = require('request-promise');
var session = require('express-session');
var secrets = require('docker-secrets-nodejs');
const { Parser } = require('json2csv');
const excel = require('node-excel-export');
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
		req.session.reporte = body;
		res.status(200).send(body);
	});
	}else{
		res.status(403).send({"error": "Unauthorized"});
	}
});


function fixData(data){
	var ndata = [];
		for(var i=0;i<data.length;i++){
			nevent = data[i];
			if(nevent["eventType"] == "1078")
				nevent["type"] = "RPM"
			else if (nevent["eventType"] == "133")
				nevent["type"] = "Inicio de Carga"
			else if (nevent["eventType"] == "132")
				nevent["type"] = "Fin de Carga"
			nevent["fecha"] = new Date(nevent["utcTimestampSeconds"]*1000).toGMTString();
			ndata.push(nevent);
	}
	return ndata;
}

router.get('/downloadCsv', function(req, res, next){
	if(req.session.user && req.session.token && req.session.reporte){
    var fields = [{label: 'Unidad', value: 'UnitId'}, 
    			{label: 'Evento', value: 'type'}, {label:'Fechay Hora',value:'fecha'}, 
    			{label:'Latitud', value:'latitude'}, {label:'Longitud', value:'longitude'}, {label:'RPM', value:'engineSpeed'}, 
    			{label:'Combustible Total Usado', value:'totalUsedFuel'}, {label:'Consumo de combustible instantaneo', value:'fuelRate'}, 
    			{label:'Nivel de combustible', value:'fuelLevel'}];
	const json2csvParser = new Parser({ fields });
	var data = req.session.reporte;
	const csv = json2csvParser.parse(fixData(data));
	res.setHeader('Content-Type', 'text/csv');
	res.setHeader('Content-Disposition', 'attachment; filename=\"reporte.csv\"');
	res.status(200).send(csv);
	}else{
		res.status(403).send({"error": "Unauthorized"});
	}
});

const styles = {
  headerDark: {
    fill: {
      fgColor: {
        rgb: 'FF000000'
      }
    },
    font: {
      color: {
        rgb: 'FFFFFFFF'
      },
      sz: 14,
      bold: true,
      underline: true
    }
  }
}

router.get('/downloadExcel', function(req, res, next){
	if(req.session.user && req.session.token && req.session.reporte){
		var heading = [
			[{value: 'Unidad',style: styles.headerDark}, {value: 'Evento',style: styles.headerDark},
			{value: 'Fecha y Hora',style: styles.headerDark}, {value: 'Latitud', style: styles.headerDark}, {value: 'Longitud',style: styles.headerDark},
			{value: 'RPM', style: styles.headerDark},{value:'Combustible Total Usado',style: styles.headerDark},
			{value:'Consumo de combustible instantaneo',style: styles.headerDark},{value:'Nivel de Combustible',style: styles.headerDark}]
		];
		var specs = {
			UnitId: {width:80}, type: {width:100},fecha: {width:200}, latitude:{width:100}, longitude: {width:100}, 
			engineSpeed: {width:80}, totalUsedFuel:{width:80}, fuelRate:{width:80}, fuelLevel: {width:80}	
		}
		var dataset = fixData(req.session.reporte);
		var report = excel.buildExport([{
      		name: 'Reporte KPIs',
      		heading: heading,
      		specification: specs,
      		data: dataset
    	}]);
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename=\"reporte.xlsx\"');
		res.status(200).send(report);
	}else{
		res.status(403).send({"error": "Unauthorized"});
	}
});


router.post('/login', function(req, res, next){
	var mzone = 'https://login.mzoneweb.net/connect/token';
	var user = req.body.user;
	var password = req.body.password;
	var mzone_secret = secrets.get("mzone_secret");
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