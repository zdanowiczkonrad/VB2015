var vbFrontend = angular.module('vbFrontend', [])

vbFrontend.controller('mainController', function($scope, $http) {

    $scope.signups = {}
    $scope.signups.team = {}
    $scope.signups.player = {}

    $scope.data = {}
    $scope.utils = {}
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

    $scope.utils.infoPopup = function(message) {
        setModalContent({
            title: "Info",
            body: message,
            primaryCaption: "Ok",
            action: closeModal
        });
        showModal();
    }

    $scope.utils.playerInfo = function(playerInfo) {
        return "About player " + playerInfo.name + ": " + (playerInfo.description ? playerInfo.description : "<not available>");
    }

    $scope.signups.signupTeam = function() {
        console.log($scope.signups.team);
        $http.post('/teams', $scope.signups.team).success(function(data) {
            console.log('team added.', data)
        });
    }

    $scope.signups.signupPlayer = function() {
        if (!$scope.signups.player.accepted) {
            setModalContent({
                title: "Warning",
                body: "Confirm, that you've read the rules of Nokia Cup 2015 and fully agree with them",
                primaryCaption: "I confirm",
                action: addPlayer
            });
            showModal();
        } else addPlayer();
    }

    var addPlayer = function() {
        $http.post('/players', $scope.signups.player).success(function(data) {
            console.log('player added.', data)
        });
        closeModal();
    }

    var setModalContent = function(modal) {
        $scope.modal = modal;
    }

    var showModal = function() {
        getModal().modal();
    }

    var closeModal = function() {
        getModal().modal('hide');
    }

    var getModal = function() {
        return $('#myModal');
    }
});
