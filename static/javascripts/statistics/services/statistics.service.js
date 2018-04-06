
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
            get: get,
        };

        return Statistics;

        function all() {
            return $http.get('/api/v1/gameinfo/');
        }

        function top(x){

        }

        function create(content) {
            return $http.post('/api/v1/gameinfo/', {
                version: content["version"],
                rounds_started: content["rounds_started"],
                rounds_won: content["rounds_won"],
                enemies_killed: content["enemies_killed"],
                coins_collected: content["coins_collected"],
                highscore: content["highscore"],
                time_spent_game: content["time_spent_game"],
            });

            //   return $http.post('/api/v1/ideas/', {
            //     "version": content["version"],
            //     "request_text": content["request_text"],
            //     "description": content["description"],
            //     "estimated_time": null,
            //     "upvotes": 0,
            //     "downvotes": 0,
            // });
        }

        function get(username) {
            return $http.get('/api/v1/accounts/' + username + '/gameinfo/');
        }


    }
})();