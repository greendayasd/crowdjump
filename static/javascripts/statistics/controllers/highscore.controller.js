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

        // Safari 3.0+ "[object HTMLElementConstructor]"
        var isSafari = /constructor/i.test(window.HTMLElement) || (function (p) {
            return p.toString() === "[object SafariRemoteNotification]";
        })(!window['safari'] || safari.pushNotification);

        if (isSafari) {
            alert("If you have the Safari update from 19.09 (Update 12) the game will not work anymore! Please use a different browser");
        }

        var topcut = 10;
        activate();


        function activate() {
            Statistics.top(topcut, versionnumber).then(statisticsSuccessFn, statisticsErrorFn);
            get_versions();

            $scope.$on('statistics.created', function (event, statistics) {
                $scope.history.unshift(statistics);
            });

            $scope.$on('statistics.created.error', function () {
                $scope.history.shift();
            });

            function statisticsSuccessFn(data, status, headers, config) {
                $scope.statistics = data.data["results"];
                setNameColor();

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
            var username = data["username"];
            if (username == 'admin') return;
            data["user"] = {"username": username};
            data["user"]["username"] = username;

            var highscore = data["highscore"];
            var eastereggs = parseInt(data["eastereggs_found"]);
            var coins = parseInt(data["coins_collected"]);

            if (highscore == "-1") {
                console.error(data + '\n' + $scope.statistics);
            }
            var found = false;
            //is player already in highscore list?
            for (var i = 0; i < $scope.statistics.length; i++) {
                if ($scope.statistics[i].user.username == username) {
                    found = true;
                    $scope.statistics[i].highscore = highscore;
                    $scope.statistics[i].coins_collected = Math.max($scope.statistics[i].coins_collected, coins);
                    $scope.statistics[i].eastereggs_found = Math.max($scope.statistics[i].eastereggs_found, eastereggs);
                    $scope.sort_all();
                    $scope.$apply();
                    return;
                }
            }
            if (!found) {
                $scope.statistics.push(data);
                $scope.sort_all();
                $scope.$apply();
                if ($scope.statistics.length > topcut) {
                    $scope.statistics.pop();
                }


            }

        }

        $scope.getVersionHighscore = function (version) {
            Statistics.top(topcut, version).then(statisticsSuccessFn, statisticsErrorFn);

            function statisticsSuccessFn(data, status, headers, config) {
                $scope.statistics = data.data["results"];
                // console.log($scope.statistics);
                setNameColor();

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
                for (var i = $scope.versions.length - 1; i >= 0; i--) {
                    switch ($scope.versions[i].id) {
                        case 4:
                        case 5:
                        case 8:
                        case 9:
                        case 11:
                        case 13:
                        case 15:
                        case 17:
                        case 19:
                        case 21:
                        case 23:
                        case 25:
                        case 27:
                        case 29:
                        case 31:
                        case 33:
                        case 35:
                        case 37:
                        case 39:
                        case 41:
                        case 43:
                            $scope.versions.splice(i, 1);
                            break;
                    }
                }


            }

            function historyErrorFn(data, status, headers, config) {
                console.error(data.error);
            }
        }

        function setNameColor() {
            for (var i = 0; i < $scope.statistics.length; i++) {
                switch ($scope.statistics[i].special_name) {
                    case 0:
                        $scope.statistics[i].color = {"color": " black"};
                        break;
                    case 1:
                        $scope.statistics[i].color = {"color": " cyan"};
                        break;
                    case 2:
                        $scope.statistics[i].color = {"color": " blue"};
                        break;
                    case 3:
                        $scope.statistics[i].color = {"color": " DarkBlue"};
                        break;
                    case 4:
                        $scope.statistics[i].color = {"color": " DarkMagenta"};
                        break;
                    case 5:
                        $scope.statistics[i].color = {"color": " DarkRed"};
                        break;
                    case 6:
                        $scope.statistics[i].color = {"color": " red"};
                        break;
                    default:
                        $scope.statistics[i].color = {"color": " black"};
                }

            }
        }
    }
})();