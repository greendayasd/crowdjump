(function () {
        'use strict';

        angular
            .module('crowdjump.admin.controllers')
            .controller('DataController', DataController);

        DataController.$inject = ['$scope', 'Authentication', 'Ideas', 'Comments', 'History', 'Votes', '$http'];

        function DataController($scope, Authentication, Ideas, Comments, History, Votes, $http) {
            var vm = this;
            vm.isAuthenticated = Authentication.isAuthenticated();
            vm.cookie = Authentication.getAuthenticatedAccount();
            vm.url = window.location.pathname;

            if (vm.url.includes("data")) {
                loadAccounts();
                loadVersions();
                loadIdeas();
                loadIdeavotes();
                loadGameinfo();
            }

            function loadAccounts() {
                $http.get('/api/v1/accounts/').then(accountsSuccessFn, accountsErrorFn);

                function accountsSuccessFn(data, status, headers, config) {
                    $scope.accounts = data.data;
                    console.log("finished 1 of 5");
                }

                function accountsErrorFn(data, status, headers, config) {
                    console.error(data.error);
                }

            }

            function loadVersions() {
                History.all().then(historySuccessFn, historyErrorFn);

                function historySuccessFn(data, status, headers, config) {
                    $scope.versions = data.data;
                    $scope.newestVersion = $scope.versions[0];
                    console.log("finished 2 of 5");

                }

                function historyErrorFn(data, status, headers, config) {
                    console.error(data.error);
                }

            }

            function loadIdeas() {
                Ideas.all().then(ideasSuccessFn, ideasErrorFn);

                function ideasSuccessFn(data, status, headers, config) {
                    $scope.ideas = data.data;
                    console.log("finished 3 of 5");

                }

                function ideasErrorFn(data, status, headers, config) {
                    var msg = "Could not get ideas";
                    console.log(msg);
                }

            }

            function loadIdeavotes() {
                Votes.all().then(ideavotesSuccessFn, ideavotesErrorFn);

                function ideavotesSuccessFn(data, status, headers, config) {
                    $scope.ideavotes = data.data;
                    console.log("finished 4 of 5");
                }

                function ideavotesErrorFn(data, status, headers, config) {
                }

            }

            function loadGameinfo() {
                $http.get('/api/v1/gameinfo/').then(accountsSuccessFn, accountsErrorFn);

                function accountsSuccessFn(data, status, headers, config) {
                    $scope.gameinfo = data.data;
                    console.log("finished 5 of 5");
                }

                function accountsErrorFn(data, status, headers, config) {
                    console.error(data.error);
                }


            }

            $scope.sortByUserData = function () {
                var statistics = '';
                var today = new Date();
                var firstVersion = new Date(2018,9,14);
                var header = form_csv('id', 'username', 'register_version', 'ideas', 'versions_played (of ' + (today.getDate()-firstVersion.getDate()) + ')', 'ideavotes', 'active');

                //find own votes for ideas
                $scope.accounts = $.map($scope.accounts, function (user) {
                    var ideas = $.grep($scope.ideas, function (idea) {
                        return idea.user.id === user.id;
                    });
                    if (typeof ideas !== 'undefined') {
                        user.ideas = ideas;
                    } else {
                        user.ideas = [];
                    }

                    var ideavotes = $.grep($scope.ideavotes, function (ideavote) {
                        return ideavote.user.id === user.id;
                    });
                    if (typeof ideavotes !== 'undefined') {
                        user.ideavotes = ideavotes;
                    } else {
                        user.ideavotes = [];
                    }

                    var gameinfos = $.grep($scope.gameinfo, function (gameinfo) {
                        return (gameinfo.user.id === user.id && gameinfo.rounds_started >0);
                    });
                    if (typeof gameinfos !== 'undefined') {
                        user.gameinfos = gameinfos;
                    } else {
                        user.gameinfos = [];
                    }

                    return user;
                });

                for (var i = 0; i < $scope.accounts.length; i++) {
                    var acc = $scope.accounts[i];
                    var dates = new Set();

                    for (var gcount = 0; gcount < acc.gameinfos.length; gcount++){
                        log(getDateFromVersion(acc.gameinfos[gcount].version_id));
                        dates.add(acc.gameinfos[gcount].version_id);
                    }
                    statistics += form_csv(acc.id, acc.username, '', acc.ideas.length, acc.gameinfos.length, acc.ideavotes.length, dates.length);
                }
                $scope.csv = header + statistics;

            };

            function getDateFromVersion (versionid){
                return $scope.versions[versionid-1].created_at.getDate();
            }
            $scope.get_json_sum = function () {
                var data = JSON.parse('[' + $scope.csv + ']');
                var rounds_won = 0,
                    enemies_killed = 0,
                    coins_collected = 0,
                    highscore = 999999,
                    time_spend_game = 0,
                    jumps = 0,
                    restarts = 0,
                    deaths = 0,
                    highest_level = 0,
                    movement_inputs = 0,
                    eastereggs_found = 0,
                    special_name = 0,
                    overall_coins = 0,
                    overall_eastereggs = 0,
                    overall_powerups = 0,
                    powerups = 0;

                for (var i = 0; i < data.length; i++) {
                    var g = data[i];
                    enemies_killed += parseInt(g.enemies_killed);
                    time_spend_game += parseInt(g.time);
                    jumps += parseInt(g.jumps);
                    movement_inputs += parseInt(g.movement_inputs);
                    coins_collected = Math.max(coins_collected, parseInt(g.coins_collected));
                    eastereggs_found = Math.max(eastereggs_found, parseInt(g.eastereggs_found));
                    special_name = Math.max(special_name, parseInt(g.special_name));
                    powerups = Math.max(powerups, parseInt(g.powerups));
                    overall_coins += g.coins_collected;
                    overall_eastereggs += g.eastereggs_found;
                    overall_powerups += g.powerups;
                    switch (g.status) {
                        case "completed":
                            rounds_won++;
                            highest_level = Math.max(highest_level, parseInt(g.level));
                            highscore = Math.min(highscore, (parseInt(g.time) - (parseInt(g.coins_collected) * 500)));
                            break;
                        case "restart":
                            restarts++;
                            break;
                        case "back to start menu":
                            break;
                        default:
                            deaths++;
                    }

                }
                $scope.csv = "rounds_started: " + data.length + '\n' +
                    "rounds_won: " + rounds_won + '\n' +
                    "enemies_killed: " + enemies_killed + '\n' +
                    "coins_collected: " + coins_collected + '\n' +
                    "time_spend_game: " + time_spend_game + '\n' +
                    "highscore: " + highscore + '\n' +
                    "jumps: " + jumps + '\n' +
                    "restarts: " + restarts + '\n' +
                    "deaths: " + deaths + '\n' +
                    "highest_level: " + highest_level + '\n' +
                    "movement_inputs:" + movement_inputs + '\n' +
                    "eastereggs_found: " + eastereggs_found + '\n' +
                    "special_name: " + special_name;
                $scope.csv += '\n' + wrapForDB(data.length, rounds_won, enemies_killed, coins_collected, highscore, time_spend_game, jumps, restarts, '', deaths, highest_level, movement_inputs, eastereggs_found, special_name);

            }
        }
    }

)();