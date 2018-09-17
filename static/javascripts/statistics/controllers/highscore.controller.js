(function () {
    'use strict';

    angular
        .module('crowdjump.statistics.controllers')
        .controller('HighscoreController', HighscoreController);

    HighscoreController.$inject = ['$scope', 'Authentication', 'Statistics', 'History'];

    function HighscoreController($scope, Authentication, Statistics, History) {
        var vm = this;
        $scope.statistics = [];
        $scope.versions = [];

        activate();


        function activate() {
            Statistics.top(5, versionnumber).then(statisticsSuccessFn, statisticsErrorFn);
            get_versions();

            $scope.$on('statistics.created', function (event, statistics) {
                $scope.history.unshift(statistics);
            });

            $scope.$on('statistics.created.error', function () {
                $scope.history.shift();
            });

            function statisticsSuccessFn(data, status, headers, config) {
                $scope.statistics = data.data["results"];
                for (var i = 0; i < $scope.statistics.length; i++){
                    switch ($scope.statistics[i].special_name){
                        case 0: $scope.statistics[i].color = {"color" :" black"}; break;
                        case 1: $scope.statistics[i].color = {"color" :" blue"}; break;
                        case 2: $scope.statistics[i].color = {"color" :" red"}; break;
                        default: $scope.statistics[i].color = {"color" :" black"};
                    }

                }

            }

            function statisticsErrorFn(data, status, headers, config) {
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
            var user = data["username"];
            if (user == ''){
                user = data["user"]["username"];
            }
            var highscore = data["highscore"];
            if(highscore == "-0.001"){
                console.error(data + '\n' + $scope.statistics);
            }
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
                $scope.sort_all();
                $scope.$apply();
                $scope.statistics.pop();


            }

        }

        $scope.getVersionHighscore = function (version) {
            Statistics.top(5, version).then(statisticsSuccessFn, statisticsErrorFn);


            function statisticsSuccessFn(data, status, headers, config) {
                $scope.statistics = data.data["results"];

            }

            function statisticsErrorFn(data, status, headers, config) {
                console.error(data.error);
            }

        }

        function get_versions() {
            History.all().then(historySuccessFn, historyErrorFn);

            function historySuccessFn(data, status, headers, config) {
                $scope.versions = data.data;
                $scope.versions_max = data.data;
                // $scope.versions.unshift({id: -1, label: "all"});
                $scope.newestVersion = $scope.versions[0];


            }

            function historyErrorFn(data, status, headers, config) {
                console.error(data.error);
            }
        }
    }
})();