var app = angular.module('cementos', ['ngTable', 'multipleSelect']);

app.filter('pumping', function(){
	return function(input){
		if(input == 1)
			return "Inicio de Bombeo";
		else if(input == 0)
			return "Combustible";
		else if(input == -1)
			return "Fin de Bombeo";
		else
			return "Evento Desconocido";
	}
});

app.filter('localdate', function(){
	return function(input){
		return new Date(input*1000).toLocaleString("es-MX", {timeZone: "America/Mexico_city"});
	}
});


app.controller('ReportCtrl', function($scope, NgTableParams, $http, $window){
	$scope.filter = {};
  	$scope.eventDetail = {};

  	$scope.apiVehicles = {
  		method: 'GET',
  		responseInterceptor : function (response) {
  			
  		}
  	}
	
	$scope.logout = function(){
		$http.post('./api/logout').then(function(response){
			if(response.status == 200){
				$window.location.href = './';
			}else {
				console.log("Invalid");
			}
		});	
	}

  	$scope.closeDetail = function(){
  		$('#modaldetailEvent').modal('hide');
  		$scope.eventDetail = {};
  	};

  	$scope.detail = function(event){
  		if("variables" in event && event["variables"] != ""){
  			var variables = JSON.parse(event["variables"]);
  			event["vars"] = variables;
  		}else{
  			event["vars"] = {};
  		}
  		$scope.eventDetail = event;
  		$('#modaldetailEvent').modal();
  	};
  
	$scope.searchReport = function(){
		$http.post('./api/events', $scope.filter).then(function(response){
			$scope.tableParams = new NgTableParams({filter:{}}, { dataset: response.data });
		});
	};

	$scope.downloadCsv = function(){
		 window.open('./api/downloadCsv', 'reporte.csv');;
	}
	$scope.downloadExcel = function(){
		 window.open('./api/downloadExcel', 'reporte.xlsx');;
	}
});