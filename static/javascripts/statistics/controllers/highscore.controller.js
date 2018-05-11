(function () {
    'use strict';

    angular
        .module('crowdjump.statistics.controllers')
        .controller('HighscoreController', HighscoreController);

    HighscoreController.$inject = ['$scope', 'Authentication', 'Statistics', 'History', 'Snackbar', '$cookies'];

    function HighscoreController($scope, Authentication, Statistics, History, Snackbar, $cookies) {
        var vm = this;

        $scope.statistics = [];

        activate();


        function activate() {
            Statistics.top(5).then(statisticsSuccessFn, statisticsErrorFn);

            $scope.$on('statistics.created', function (event, statistics) {
                $scope.history.unshift(statistics);
            });

            $scope.$on('statistics.created.error', function () {
                $scope.history.shift();
            });

            function statisticsSuccessFn(data, status, headers, config) {
                $scope.statistics = data.data["results"];
                // console.error("data " + data.data);

            }

            function statisticsErrorFn(data, status, headers, config) {
                Snackbar.error(data.error);
                console.error(data.error);
            }
        }


        //sorting
        var sort_by = function (field, reverse, primer) {

            var key = primer ?
                function (x) {
                    return primer(x[field])
                } :
                function (x) {
                    return x[field]
                };

            reverse = !reverse ? 1 : -1;

            return function (a, b) {
                return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
            }
        }

        $scope.sort_all = function () {
            $scope.statistics.sort(sort_by("highscore", false, parseInt));

        }
        var ws_scheme = 'wss'; //window.location.protocol == "https:" ? "wss" : "ws";
        var port = ':8001';
        if (window.location.host == "localhost:8000") {
            port = '';
        }
        //Websocket
        var highscoreSocket = new WebSocket(
            ws_scheme + '://' + window.location.host + port +
            '/ws/website/');

        highscoreSocket.onmessage = function (e) {
            var data = JSON.parse(e.data);
            // console.log("type " + data["type"]);
            if (data["type"] == 'highscore_broadcast') {
                receive_highscore(data);
            }

        };

        function receive_highscore(data) {
            // console.log(data);
            var user = data["user"]["username"];
            var highscore = data["highscore"];
            // console.log(user);
            // console.log(highscore);
            var found = false;
            //is player already in highscore list?
            for (var i = 0; i < $scope.statistics.length; i++) {
                if ($scope.statistics[i].user.username == user) {
                    found = true;
                    $scope.statistics[i].highscore = highscore;
                    $scope.sort_all();
                    $scope.$apply();
                    return;
                }
            }
            if (!found) {
                $scope.statistics.push(data);
                console.log("1 " + JSON.stringify($scope.statistics));
                $scope.sort_all();
                console.log("2 " + JSON.stringify($scope.statistics));
                $scope.$apply();
                $scope.statistics.pop();


            }

        }
    }
})();