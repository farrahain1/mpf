'use strict';
 
angular.module('mpf.login', ['ionic','firebase'])
 
// Declared route 


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('login', {
    	url: '/login',
        templateUrl: 'templates/login.html',
        controller: 'loginCtrl'
    });
})
 
// Home controller
.controller('loginCtrl', [function($scope,$firebaseSimpleLogin) {
 	$scope.SignIn = function($scope) {
    var username = $scope.user.email;
    var password = $scope.user.password;
     
    // Auth Logic
    loginObj.$login('password', {
            email: username,
            password: password
        })
        .then(function(user) {
            // Success callback
            console.log('Authentication successful');
        }, function(error) {
            // Failure callback
            console.log('Authentication failure');
        });
}

var firebaseObj = new Firebase("https://mpf.firebaseio.com"); 
var loginObj = $firebaseSimpleLogin(firebaseObj);


}]);