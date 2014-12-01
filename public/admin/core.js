var vbAdmin = angular.module('vbAdmin', [])

vbAdmin.controller('mainController', function($scope, $http) {

	$scope.data = {}
    $scope.utils = {}

    $http.get('/admin/logged').success(function(data) {
    	console.log(data);
    })
        /**
         * Constructor
         */
        // load team data
    $http.get('/teams').success(function(data) {
        $scope.data.teams = data;
        console.log('Loading teams succeeded', data);
    });

    $http.get('/players').success(function(data) {
        $scope.data.players = data;
        console.log('Loading players succeeded', data);
    });

    $http.get('/news').success(function(data) {
        $scope.data.news = data;
        console.log('Loading news succeeded', data);
    });


 });