var app = angular.module('gvt-ng', []);

app.controller('MainCtrl', function ($scope, $http, $window) {
	
	$scope.login = function(){
		var loginForm = $scope.loginForm;
		$http.post('./api/login', loginForm).then(function(response){
			if(response.status == 200){
				$window.location.href = '/';
			}else {
				console.log("Invalid");
			}
		});
	}
});