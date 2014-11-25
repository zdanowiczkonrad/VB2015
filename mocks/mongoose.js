module.exports = (function() {
    var blank = function() {};

    var teams = {
        find: function(callback) {
            callback({}, require('./teams.json'));
        }
    }

    var model = function(documentName) {
        if (documentName == "teams") {
            return teams;
        } else if (documentName = "users") {
            return blank;
        }
    }

    return {
        "connect": blank,
        "Schema": blank,
        "model": model
    }
})()
