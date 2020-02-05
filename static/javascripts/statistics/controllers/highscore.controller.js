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
        $scope.currentVersion = '';
        $scope.lastData = '';
        $scope.difficulties = [];
        $scope.difficulties.push({"id": 0, "label": "easy"});
        $scope.difficulties.push({"id": 1, "label": "normal"});
        $scope.difficulties.push({"id": 2, "label": "hard"});
        $scope.difficulty = 1;


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
            get_versions();
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
        };

        $scope.sort_all = function () {
            $scope.statistics.sort(sort_by("highscore", false, parseInt));

        };

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
            if (data["type"] == 'highscore_broadcast') {
                receive_highscore(data);
            }

        };

        function receive_highscore(data) {
            var difficulty = parseInt(data["difficulty"]);

            if ($scope.currentVersion != versionnumber || difficulty != $scope.difficulty.id) {
                $scope.lastData = data;
                $scope.getVersionHighscore(versionnumber, $scope.difficulties[difficulty], true);
            }
            else ($scope.updateHighscore(data));
        }

        $scope.updateHighscore = function (data) {
            var username = data["username"];
            if (username == 'admin') return;
            data["user"] = {"username": username};
            data["user"]["username"] = username;


            var highscore = parseInt(data["highscore"]);
            var eastereggs = parseInt(data["overall_eastereggs"]);
            var coins = parseInt(data["overall_coins"]);
            var special_name = parseInt(data["special_name"]);

            if (highscore == -1) {
                console.error(data + '\n' + $scope.statistics);
                return;
            }
            var found = false;
            //is player already in highscore list?
            for (var i = 0; i < $scope.statistics.length; i++) {
                if ($scope.statistics[i].user.username == username) {
                    found = true;
                    $scope.statistics[i].highscore = highscore;
                    $scope.statistics[i].coins_collected = Math.max($scope.statistics[i].coins_collected, coins);
                    $scope.statistics[i].eastereggs_found = Math.max($scope.statistics[i].eastereggs_found, eastereggs);
                    $scope.statistics[i].special_name = Math.max($scope.statistics[i].special_name, special_name);
                    $scope.sort_all();
                    $scope.$apply();
                    setNameColor();
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
                setNameColor();
            }
        };

        $scope.getVersionHighscore = function (version, difficulty, receiveScore) {
            $scope.difficulty = difficulty;
            log($scope.difficulty);
            $scope.currentVersion = version;

            Statistics.top(topcut, version, difficulty.id).then(statisticsSuccessFn, statisticsErrorFn);

            function statisticsSuccessFn(data, status, headers, config) {
                $scope.statistics = data.data["results"];
                log(data);

                if (receiveScore) $scope.updateHighscore($scope.lastData);
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
                        // case 44:
                        // case 42:
                        // case 40:
                        // case 38:
                        // case 36:
                        // case 34:
                        // case 32:
                        // case 30:
                        // case 28:
                        // case 26:
                        // case 24:
                        // case 22:
                        // case 20:
                        // case 18:
                        // case 16:
                        // case 14:
                        // case 12:
                        // case 10:
                        // case 7:
                        // case 6:
                            $scope.versions.splice(i, 1);
                            break;
                    }

                    //set to first
                    $scope.newestVersion = $scope.versions[0];
                    //set to normal
                    $scope.difficulty = $scope.difficulties[1];
                }

            Statistics.top(topcut, $scope.newestVersion.id, $scope.difficulty).then(statisticsSuccessFn, statisticsErrorFn);

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