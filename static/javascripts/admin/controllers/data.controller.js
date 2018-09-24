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
                var firstVersion = new Date(2018, 9, 14);
                var amountVersions = today.getDate() - firstVersion.getDate();
                var header = form_csv('id', 'username', 'register_version', 'ideas', 'ideavotes', 'versions_played (of ' + amountVersions + ')', 'activeAnd', 'activeOr', 'last_online');

                var playedIdea80 = 0;
                var playedIdea50 = 0;
                var playedIdea20 = 0;
                var playedIdea = 0;
                var playedOrIdea80 = 0;
                var playedOrIdea50 = 0;
                var playedOrIdea20 = 0;
                var playedOrIdea = 0;

                var dailyList = [];
                var accidToLocationJson = {};
                for (var a = 0; a <21; a++){
                    //days
                    var dayArray = [];
                    dailyList.push(dayArray);

                    //day -> users
                    for(var us = 0; us < $scope.accounts.length; us++){
                        var usArray = [];
                        // dailyList[a].push(usArray);
                        accidToLocationJson[$scope.accounts[us].id] = us;

                        //day -> user -> data
                        var accjson = {
                            "username": $scope.accounts[us].username,
                            "ideas": 0,
                            "ideavotes": 0,
                            "rounds_started": 0,
                            "rounds_won": 0
                        };
                        dailyList[a].push(accjson);
                    }
                }


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
                        return (gameinfo.user.id === user.id && gameinfo.rounds_started > 0);
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
                    var accPos = accidToLocationJson[acc.id];
                    var last_online = convertJSDateFull(acc.created_at);

                    //filter accounts
                    switch (acc.id) {
                        case 1:
                        case 21:
                        case 22:
                            continue;
                    }

                    var datesIdeas = new Set();
                    var datesOr = new Set();
                    for (var gcount = 0; gcount < acc.gameinfos.length; gcount++) {
                        var g = acc.gameinfos[gcount];
                        var gdate = convertJSDate(g.version.created_at);
                        var version = dateToArrayPos(gdate);

                        dailyList[version][accPos]["rounds_started"] = g.rounds_started;
                        dailyList[version][accPos]["rounds_won"] = g.rounds_won;

                        if (last_online - getDateFromVersion(g.version.id) < 0) last_online = getDateFromVersion(g.version.id);

                        datesOr.add(gdate);

                    }
                    for (var icount = 0; icount < acc.ideas.length; icount++) {
                        var idea = acc.ideas[icount];
                        var idate = convertJSDate(idea.created_at);
                        var version = dateToArrayPos(idate);

                        dailyList[version][accPos]["ideas"] ++;

                        if (last_online - convertJSDateFull(idea.created_at) < 0) last_online = convertJSDateFull(idea.created_at);

                        datesIdeas.add(idate);
                    }

                    for (var vcount = 0; vcount < acc.ideavotes.length; vcount++) {
                        var vote = acc.ideavotes[vcount];
                        var vdate = convertJSDate(vote.created_at);
                        var version = dateToArrayPos(vdate);

                        dailyList[version][accPos]["ideavotes"] ++;

                        if (last_online - convertJSDateFull(vote.created_at) < 0) last_online = convertJSDateFull(vote.created_at);

                        datesIdeas.add(vdate);
                    }

                    //intersect and union
                    var datesAnd = new Set([...datesIdeas].filter(x=> datesOr.has(x)));
                    var datesOr = new Set([...datesOr,...datesIdeas]);
                    // var datesAnd = new Set([...datesIdeas].filter(x=> datesOr.has(x)));
                    // var datesOr = new Set([...datesOr,...datesIdeas]);

                    var andPercentage = datesAnd.size / amountVersions;
                    var orPercentage = datesOr.size / amountVersions;

                    if (andPercentage >= 0.8) playedIdea80++;
                    if (andPercentage >= 0.5) playedIdea50++;
                    if (andPercentage >= 0.2) playedIdea20++;
                    if (andPercentage > 0) playedIdea++;

                    if (orPercentage >= 0.8) playedOrIdea80++;
                    if (orPercentage >= 0.5) playedOrIdea50++;
                    if (orPercentage >= 0.2) playedOrIdea20++;
                    if (orPercentage > 0) playedOrIdea++;

                    last_online = moment(last_online);
                    var creationDate = moment(convertJSDateFull(acc.created_at));
                    statistics += form_csv(acc.id, acc.username, creationDate.format('DD-MM-YYYY'), acc.ideas.length, acc.ideavotes.length, acc.gameinfos.length, datesAnd.size, datesOr.size, last_online.format('DD-MM-YYYY'));
                }
                $scope.csv = header + statistics;
                $scope.stats = '80% played + idea ' + playedIdea80 + '\n';
                $scope.stats += '50% played + idea ' + playedIdea50 + '\n';
                $scope.stats += '20% played + idea ' + playedIdea20 + '\n';
                $scope.stats += 'at least one played + idea ' + playedIdea + '\n\n';

                $scope.stats += '80% played OR idea ' + playedOrIdea80 + '\n';
                $scope.stats += '50% played OR idea ' + playedOrIdea50 + '\n';
                $scope.stats += '20% played OR idea ' + playedOrIdea20 + '\n';
                $scope.stats += 'at least one played OR idea ' + playedOrIdea;

                setTimeout($scope.createFile($scope.csv, 'user stats ' + today.getDate() + '-' + (today.getMonth()+1) + '.csv', 'text/csv', 'dlcsv'));

                $scope.daily = 'day, user, ideas, votes, rounds started, rounds_won\n';

                for (var d = 0; d < dailyList.length; d++){
                    var list = dailyList[d];
                    var date = '';
                    if (d>= 17) date = d-16 + '.10';
                    else date = d+14 + '.09';
                    for (var u = 0; u < list.length; u++){
                        var user = list[u];
                        if (user.ideas == 0 && user.ideavotes == 0 && user.rounds_started == 0) continue;
                        else $scope.daily += form_csv(date, user.username, user.ideas, user.ideavotes, user.rounds_started, user.rounds_won);
                    }
                    $scope.daily += '\n'
                }
                setTimeout($scope.createFile($scope.daily, 'daily report ' + today.getDate() + '-' + (today.getMonth()+1) + '.csv', 'text/csv', 'dldaily'));

            };

            function convertJSDate(date) {
                var dateParts = date.split("-");
                var afterDate = date.split("T");
                var beforehours = afterDate[1].split(".");
                var time = beforehours[0].split(":");
                var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2));
                if (time[0] > 19){
                    return jsDate.getDate()+1;
                }else{
                    return jsDate.getDate();
                }
            }

            function convertJSDateFull(date) {
                var dateParts = date.split("-");
                var afterDate = date.split("T");
                var beforehours = afterDate[1].split(".");
                var time = beforehours[0].split(":");
                var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2),time[0], time[1], time[2]);
                return jsDate;
            }

            function getDateFromVersion(version){
                return convertJSDateFull($scope.versions[version-1].created_at);
            }

            function dateToArrayPos(date){
                if (date <30) return date-14;
                else return date + 16;
            }

            $scope.createFile = function (text, name, type, elementname) {
                var dlcsv = document.getElementById(elementname);
                var file = new Blob([text], {type: type});
                dlcsv.href = URL.createObjectURL(file);
                dlcsv.download = name;
            }

            $scope.get_json_sum = function () {
                var data = JSON.parse('[' + $scope.stats + ']');
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