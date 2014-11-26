var vbFrontend = angular.module('vbFrontend', [])

function mainController($scope, $http) {

    $scope.data = {}

    /**
     * Constructor
     */
    // load team data
    $http.get('/teams').success(function(data) {
        $scope.data.teams = data;
        console.log("Loading teams succeeded", data);
    });


    $scope.utils = {};

    $scope.utils.getTeamStatusClass = function(team) {
        return {
            "warning": team.reserve
        };
    }

    $scope.utils.isPrimary = function(tabName,currentlyVisible) {
        console.log(tabName,currentlyVisible);
        return {
            "btn-primary": tabName==currentlyVisible
        };  
    }

    $scope.signups = {}
    $scope.signups.team = {}

    $scope.signups.signupTeam = function() {
        console.log($scope.signups.team);
        // business logic -> POST on teams endpoint
    }

}
