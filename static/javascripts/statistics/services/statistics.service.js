
(function () {
    'use strict';

    angular
        .module('crowdjump.statistics.services')
        .factory('Statistics', Statistics);

    Statistics.$inject = ['$http', 'History'];

    function Statistics($http, History) {
        var Statistics = {
            all: all,
            top: top,
            create: create,
            newVersion: newVersion,
            get: get,
        };

        return Statistics;

        function all() {
            return $http.get('/api/v1/gameinfo/');
        }

        function top(x, version){
            return $http.get('/api/v1/gameinfo/?version__id=' + version + '&highscore__gt=0' + '&user__username!=admin' + '&limit=' + x);
        }

        function newVersion(){
            return
        }
        function create() {
            return $http.post('/api/v1/gameinfo/', {
                // version: versionnumber,
                // rounds_started: content["rounds_started"],
                // rounds_won: content["rounds_won"],
                // enemies_killed: content["enemies_killed"],
                // coins_collected: content["coins_collected"],
                // highscore: content["highscore"],
                // time_spent_game: content["time_spent_game"],
                rounds_started: 0,
                rounds_won: 0,
                enemies_killed: 0,
                coins_collected: 0,
                highscore: -1,
                movement_inputs: 0,
                jumps: 0,
                deaths: 0,
                restarts: 0,
                time_spent_game: 0,
            });
        }

        function get(username) {
            return $http.get('/api/v1/accounts/' + username + '/gameinfo/');
        }


    }
})();