var vbFrontend = angular.module('vbFrontend', [])

vbFrontend.controller('mainController', function($scope, $http) {

    $scope.data = {}
    $('a').click(function() {
        console.log('test')
    });
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

    $scope.utils = {};

    $scope.utils.getTeamStatusClass = function(team) {
        return {
            'warning': team.reserve
        };
    }

    $scope.utils.isPrimary = function(tabName, currentlyVisible) {
        console.log(tabName, currentlyVisible);
        return {
            'btn-primary': tabName == currentlyVisible
        };
    }

    $scope.signups = {}
    $scope.signups.team = {}
    $scope.signups.player = {}

    $scope.signups.signupTeam = function() {
        console.log($scope.signups.team);
        $http.post('/teams', $scope.signups.team).success(function(data) {
            console.log('team added.', data)
        });
    }

    $scope.signups.signupPlayer = function() {
        if (!$scope.signups.player.accepted) {
            showModal({
                title: "Warning",
                body: "Confirm, that you've read the rules of Nokia Cup 2015 and fully agree with them",
                primaryCaption: "I confirm",
                action: addPlayer
            });
        } else addPlayer();
    }

    var addPlayer = function() {
        $http.post('/players', $scope.signups.player).success(function(data) {
            console.log('player added.', data)
        });
        getModal().modal('hide');
    }

    var setModalContent = function(modal) {
        $scope.modal = modal;
    }

    var showModal = function(content) {
        setModalContent(content);
        $('#myModal').modal();
    }

    var getModal = function() {
        return $('#myModal');
    }
});
