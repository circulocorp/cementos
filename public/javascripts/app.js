var app = angular.module('cementos', ['ngTable']);

app.controller('MainCtrl', function ($scope, $http, $window) {
	
	$scope.login = function(){
		var loginForm = $scope.loginForm;
		$http.post('./api/login', loginForm).then(function(response){
			if(response.status == 200){
				$window.location.href = '/';
			}
		});
	}
});

app.controller('ReportCtrl', function($scope, NgTableParams, $http){
	$scope.filter = {};
	$scope.dpFormat = 'dd-MMMM-yyyy';
	$scope.dateOptions = {
    	formatYear: 'yy',
    	maxDate: new Date(2020, 5, 22),
    	minDate: new Date(),
    	startingDay: 1
  	};

  	$scope.popup1 = {
    	opened: false
  	};
  	$scope.open1 = function() {
    	$scope.popup1.opened = true;
  	};
	$scope.searchReport = function(){
		$http.post('./api/events', $scope.filter).then(function(response){
			$scope.tableParams = new NgTableParams({filter:{}}, { dataset: response.data });
		});
	}
});