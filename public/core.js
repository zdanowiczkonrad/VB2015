var vbFrontend = angular.module('vbFrontend', [])

vbFrontend.controller('mainController', function($scope, $http, $interval) {

    $scope.settings = {
        'admin': false,
        'pullInterval': 10 * 1000
    }

    $scope.signups = {}
    $scope.signups.team = {}
    $scope.signups.player = {}

    $scope.data = {}
    $scope.utils = {}

    var loadAllData = function() {
            console.log("loading all data...");

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

            $http.get('/admin/logged').success(function(data, status) {
                if (!$scope.settings.admin) {
                    console.log("authorized.");
                }
                $scope.settings.admin = true;

            }).error(function(data, status) {
                $scope.settings.admin = false;
            });
        }
        /**
         * Constructor
         */
        // load team data
    loadAllData();
    $interval(loadAllData, $scope.settings.pullInterval);

    $scope.utils.getTeamStatusClass = function(team) {
        return {
            'success': team.approved
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
        if (!$scope.signups.team.accepted) {
            setModalContent({
                title: "Warning",
                body: "Confirm, that you've read the rules of Nokia Cup 2015 and fully agree with them!",
                primaryCaption: "I confirm",
                action: addTeam
            });
            showModal();
        } else {
            addTeam();
        }
    }

    var showValidationError = function() {
        setModalContent({
            title: "Error",
            body: "Fill in all required fields.",
            primaryCaption: "Go back to the form",
            action: closeModal
        });
        showModal();
    }

    var addTeam = function() {
        $scope.signups.team.accepted = true;
        if (!validateTeam($scope.signups.team)) {
            showValidationError();
        } else {
            $http.post('/teams', $scope.signups.team).success(function(data) {
                closeModal();
                setModalContent({
                    title: "Successful",
                    body: "You have successfully registered team " + $scope.signups.team.name + " to the Nokia Volleyball Cup 2015!",
                    primaryCaption: "Ok, cool!",
                    action: closeModal
                });
                showModal();
            });
        }
    }

    var validateTeam = function(o) {
        return o.name && o.mail && o.captain && o.description && o.members;
    }

    $scope.signups.signupPlayer = function() {
        if (!$scope.signups.player.accepted) {
            setModalContent({
                title: "Warning",
                body: "Confirm, that you've read the rules of Nokia Cup 2015 and fully agree with them!",
                primaryCaption: "I confirm",
                action: addPlayer
            });
            showModal();
        } else addPlayer();
    }
    var validatePlayer = function(o) {
        return o.name && o.mail;
    }
    var addPlayer = function() {
        $scope.signups.player.accepted = true;
        if (!validatePlayer($scope.signups.player)) {
            showValidationError();
        } else {
            $http.post('/players', $scope.signups.player).success(function(data) {
                closeModal();
                setModalContent({
                    title: "Successful",
                    body: "You have successfully registered to the players list",
                    primaryCaption: "Ok, cool!",
                    action: closeModal
                });
                showModal();
            });
        }
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

    $scope.admin = {}
    $scope.admin.approve = function(teamId) {
        $http.post('/teams/' + teamId + '/approve').success(function(data) {
            $scope.utils.infoPopup("Team approved");
        }).error(function() {
            $scope.utils.infoPopup("You are not allowed to approve team");
        });
    }

    $scope.admin.unapprove = function(teamId) {
        $http.post('/teams/' + teamId + '/unapprove').success(function(data) {
            $scope.utils.infoPopup("Team unapproved");
        }).error(function() {
            $scope.utils.infoPopup("You are not allowed to unapprove team");
        });
    }
    $scope.admin.addNews = {};

    $scope.admin.addNews.submit = function(news) {
        $http.post('/news', news).success(function(data) {
            $scope.utils.infoPopup("News added");
        }).error(function() {
            $scope.utils.infoPopup("You are not allowed to add news.");
        });
    }
});
