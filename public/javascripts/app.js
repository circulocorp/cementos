var app = angular.module('cementos', ['ngTable']);

app.filter('pumping', function(){
	return function(input){
		if(input == 1)
			return "Inicio de Carga";
		else if(input == 0)
			return "Evento CAN";
		else if(input == -1)
			return "Fin de Carga";
		else
			return "Evento Desconocido";
	}
});



app.controller('ReportCtrl', function($scope, NgTableParams, $http){
	$scope.filter = {};
  	$scope.eventDetail = {};
  	
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
		console.log("Download csv");
		
	}
});