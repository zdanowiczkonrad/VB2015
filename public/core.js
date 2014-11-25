var vbFrontend = angular.module('vbFrontend', [])

function mainController($scope, $http) {
    $scope.staticTexts = {
        "example": "this works"
    }

    console.log("siema siema");
    $http.get('/teams').success(function(data) {
        console.log(data);
    });

}
