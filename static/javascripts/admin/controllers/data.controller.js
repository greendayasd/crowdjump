(function () {
        'use strict';

        angular
            .module('crowdjump.admin.controllers')
            .controller('DataController', DataController);

        DataController.$inject = ['$scope', 'Authentication', 'Ideas', 'Comments', 'History', 'Votes', '$http'];

        function DataController($scope, Authentication, Ideas, Comments, History, Votes, $http) {
            var vm = this;
            var millisecondsPerMinute = 60000;
            var millisecondsPerHour = millisecondsPerMinute * 60;

            vm.isAuthenticated = Authentication.isAuthenticated();
            vm.cookie = Authentication.getAuthenticatedAccount();
            vm.url = window.location.pathname;

            if (vm.url.includes("data")) {
                loadAccounts();
                loadComments();
                loadVersions();
                loadIdeas();
                loadIdeavotes();
                loadGameinfo();
            }

            function loadAccounts() {
                $http.get('/api/v1/accounts/').then(accountsSuccessFn, accountsErrorFn);

                function accountsSuccessFn(data, status, headers, config) {
                    $scope.accounts = data.data;
                    console.log("Accounts finished 1 of 6");
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
                    console.log("Versions finished 2 of 6");

                }

                function historyErrorFn(data, status, headers, config) {
                    console.error(data.error);
                }

            }

            function loadIdeas() {
                Ideas.all().then(ideasSuccessFn, ideasErrorFn);

                function ideasSuccessFn(data, status, headers, config) {
                    $scope.ideas = data.data;
                    console.log("Ideas finished 3 of 6");

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
                    console.log("Ideavotes finished 4 of 6");
                }

                function ideavotesErrorFn(data, status, headers, config) {
                }

            }

            function loadGameinfo() {
                $http.get('/api/v1/gameinfo/').then(accountsSuccessFn, accountsErrorFn);

                function accountsSuccessFn(data, status, headers, config) {
                    $scope.gameinfo = data.data;
                    console.log("Gameinfo finished 5 of 6");
                }

                function accountsErrorFn(data, status, headers, config) {
                    console.error(data.error);
                }


            }

            function loadComments() {
                Comments.all().then(commentsSuccessFn, commentsErrorFn);

                function commentsSuccessFn(data, status, headers, config) {
                    $scope.comments = data.data;
                }

                function commentsErrorFn(data, status, headers, config) {
                }

                console.log("Comments finished 6 of 6");
            }

            $scope.sortByUserData = function () {
                var statistics = '';
                var today = new Date();
                var firstVersion = new Date(2018, 9, 14);
                var amountVersions = (today.getDate() + 30 - firstVersion.getDate()) % 30;
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
                for (var a = 0; a < 23; a++) {
                    //days
                    var dayArray = [];
                    dailyList.push(dayArray);

                    //day -> users
                    for (var us = 0; us < $scope.accounts.length; us++) {
                        var usArray = [];
                        // dailyList[a].push(usArray);
                        accidToLocationJson[$scope.accounts[us].id] = us;

                        //day -> user -> data
                        var accjson = {
                            "username": $scope.accounts[us].username,
                            "id": $scope.accounts[us].id,
                            "ideas": 0,
                            "upvotes": 0,
                            "downvotes": 0,
                            "rounds_started": 0,
                            "rounds_won": 0,
                            "comments": 0
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

                    var comments = $.grep($scope.comments, function (comment) {
                        return (comment.user.id === user.id);
                    });
                    if (typeof comments !== 'undefined') {
                        user.comments = comments;
                    } else {
                        user.comments = [];
                    }

                    return user;
                });

                for (var i = 0; i < $scope.accounts.length; i++) {
                    var acc = $scope.accounts[i];
                    var accPos = accidToLocationJson[acc.id];
                    var last_online = convertJSDateFull(acc.created_at);

                    //filter accounts
                    switch (acc.id) {
                        case 32:
                            accPos = accidToLocationJson[27];
                            break;
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
                        // log(gdate,version);
                        dailyList[version][accPos]["rounds_started"] = g.rounds_started;
                        dailyList[version][accPos]["rounds_won"] = g.rounds_won;

                        if (last_online - getDateFromVersion(g.version.id) < 0) last_online = getDateFromVersion(g.version.id);

                        datesOr.add(gdate);

                    }
                    for (var icount = 0; icount < acc.ideas.length; icount++) {
                        var idea = acc.ideas[icount];
                        var idate = convertJSDate(idea.created_at);
                        var version = dateToArrayPos(idate);

                        dailyList[version][accPos]["ideas"]++;

                        if (last_online - convertJSDateFull(idea.created_at) < 0) last_online = convertJSDateFull(idea.created_at);

                        datesIdeas.add(idate);
                    }

                    for (var vcount = 0; vcount < acc.ideavotes.length; vcount++) {
                        var vote = acc.ideavotes[vcount];
                        var vdate = convertJSDate(vote.created_at);
                        var version = dateToArrayPos(vdate);
                        // log(vdate,version);

                        // log(vote);
                        if (vote.vote >= 1) dailyList[version][accPos]["upvotes"]++;
                        if (vote.vote <= -1) dailyList[version][accPos]["downvotes"]++;

                        if (last_online - convertJSDateFull(vote.created_at) < 0) last_online = convertJSDateFull(vote.created_at);

                        datesIdeas.add(vdate);
                    }

                    for (var ccount = 0; ccount < acc.comments.length; ccount++) {
                        var comment = acc.comments[ccount];
                        var cdate = convertJSDate(vote.created_at);
                        var version = dateToArrayPos(cdate);

                        dailyList[version][accPos]["comments"]++;

                        if (last_online - convertJSDateFull(comment.created_at) < 0) last_online = convertJSDateFull(comment.created_at);

                        datesIdeas.add(cdate);
                    }

                    //intersect and union
                    var datesAnd = new Set([...datesIdeas].filter(x => datesOr.has(x)));
                    var datesOr = new Set([...datesOr, ...datesIdeas]);
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

                $scope.stats += '80% played OR idea OR Comment ' + playedOrIdea80 + '\n';
                $scope.stats += '50% played OR idea OR Comment ' + playedOrIdea50 + '\n';
                $scope.stats += '20% played OR idea OR Comment ' + playedOrIdea20 + '\n';
                $scope.stats += 'at least one played OR idea OR Comment ' + playedOrIdea;

                setTimeout($scope.createFile($scope.csv, 'user stats ' + today.getDate() + '-' + (today.getMonth() + 1) + '.csv', 'text/csv', 'dlcsv'));

                $scope.daily = 'version, user, upvotes, downvotes\n';
                // $scope.daily = 'version, user, ideas, votes, rounds started, rounds_won, comments\n';

                for (var d = 0; d < dailyList.length; d++) {
                    var list = dailyList[d];
                    var version_day = '';
                    var date = ' bis ';
                    if (d >= 16) date += d - 15 + '.10';
                    else date += d + 15 + '.09';
                    date += ' 19:00';
                    switch (d) {
                        case 0:
                            version_day = '0.01';
                            break;
                        case 1:
                            version_day = '0.02';
                            break;
                        case 2:
                            version_day = '0.03';
                            break;
                        case 3:
                            version_day = '0.06';
                            break;
                        case 4:
                            version_day = '0.07';
                            break;
                        case 5:
                            version_day = '0.10';
                            break;
                        case 6:
                            version_day = '0.12';
                            break;
                        case 7:
                            version_day = '0.14';
                            break;
                        case 8:
                            version_day = '0.16';
                            break;
                        case 9:
                            version_day = '0.18';
                            break;
                        case 10:
                            version_day = '0.20';
                            break;
                        case 11:
                            version_day = '0.22';
                            break;
                        case 12:
                            version_day = '0.24';
                            break;
                        case 13:
                            version_day = '0.26';
                            break;
                        case 14:
                            version_day = '0.28';
                            break;
                        case 15:
                            version_day = '0.30';
                            break;
                        case 16:
                            version_day = '0.32';
                            break;
                        case 17:
                            version_day = '0.34';
                            break;
                        case 18:
                            version_day = '0.36';
                            break;
                        case 19:
                            version_day = '0.38';
                            break;
                        case 20:
                            version_day = '0.40';
                            break;
                        case 21:
                            version_day = '0.42';
                            break;
                        case 22:
                            version_day = '0.44';
                            break;
                    }
                    version_day = 'v' + version_day + date;
                    $scope.daily +=version_day + '\n';
                    for (var u = 0; u < list.length; u++) {
                        var user = list[u];
                        switch (user.id) {
                            case 1:
                            case 13:
                            case 16:
                            case 21:
                            case 22:
                            case 23:
                            case 30:
                            case 32:
                                continue;
                        }
                        if (user.ideas == 0 && user.ideavotes == 0 && user.rounds_started == 0) continue;
                        else $scope.daily += user.upvotes + '\t' +  user.downvotes + '\n';
                        // else $scope.daily += form_csv(version_day, user.username, user.ideas, user.ideavotes, user.rounds_started, user.rounds_won, user.comments);
                    }
                    $scope.daily += '\n'
                }
                setTimeout($scope.createFile($scope.daily, 'daily report ' + today.getDate() + '-' + (today.getMonth() + 1) + '.csv', 'text/csv', 'dldaily'));

            };

            function convertJSDate(date) {
                var dateParts = date.split("-");
                var afterDate = date.split("T");
                var beforehours = afterDate[1].split(".");
                var time = beforehours[0].split(":");
                var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2), time[0], time[1], time[2]);
                if (jsDate.getMonth() >= 9 && jsDate.getDate() >= 6) return 6;
                if (jsDate.getDate() == 14) return (jsDate.getDate() + 1);
                if (time[0] >= 19) {
                    if (jsDate.getDate() == 30) return 1;
                    return (jsDate.getDate() + 1);
                } else {
                    return jsDate.getDate();
                }
            }

            function convertJSDateFull(date) {
                var dateParts = date.split("-");
                var afterDate = date.split("T");
                var beforehours = afterDate[1].split(".");
                var time = beforehours[0].split(":");
                var jsDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2].substr(0, 2), time[0], time[1], time[2]);
                return jsDate;
            }

            function getDateFromVersion(version) {
                return convertJSDateFull($scope.versions[version - 1].created_at);
            }

            function dateToArrayPos(date) {
                if (date <= 30 && date >= 14) return date - 15;
                else return date + 15;
            }

            $scope.createFile = function (text, name, type, elementname) {
                var dlcsv = document.getElementById(elementname);
                var file = new Blob([text], {type: type});
                dlcsv.href = URL.createObjectURL(file);
                dlcsv.download = name;
            }

            $scope.get_json_sum = function () {
                console.log($scope.stats);
                var data = JSON.parse('[' + $scope.stats + ']');
                var difficulty = [0, 1, 2],
                    rounds_started = [0, 0, 0],
                    rounds_won = [0, 0, 0],
                    enemies_killed = [0, 0, 0],
                    coins_collected = [0, 0, 0],
                    highscore = [999999, 999999, 999999],
                    time_spend_game = [0, 0, 0],
                    jumps = [0, 0, 0],
                    restarts = [0, 0, 0],
                    deaths = [0, 0, 0],
                    highest_level = [0, 0, 0],
                    movement_inputs = [0, 0, 0],
                    eastereggs_found = [0, 0, 0],
                    special_name = [0, 0, 0],
                    overall_coins = [0, 0, 0],
                    overall_eastereggs = [0, 0, 0],
                    overall_powerups = [0, 0, 0],
                    powerups = [0, 0, 0];

                for (var i = 0; i < data.length; i++) {
                    var g = data[i];
                    var d;
                    (g.difficulty == undefined) ? d = 1 : d = parseInt(g.difficulty);
                    enemies_killed[d] += parseInt(g.enemies_killed);
                    time_spend_game[d] += parseInt(g.time);
                    jumps[d] += parseInt(g.jumps);
                    movement_inputs[d] += parseInt(g.movement_inputs);
                    coins_collected[d] = Math.max(coins_collected[d], parseInt(g.coins_collected));
                    eastereggs_found[d] = Math.max(eastereggs_found[d], parseInt(g.eastereggs_found));
                    special_name[d] = Math.max(special_name[d], parseInt(g.special_name));
                    powerups[d] = Math.max(powerups[d], parseInt(g.powerups));
                    overall_coins[d] += parseInt(g.coins_collected);
                    overall_eastereggs[d] += parseInt(g.eastereggs_found);
                    overall_powerups[d] += parseInt(g.powerups);

                    if (g.level == '1') rounds_started[i]++;

                    switch (g.status) {
                        case "completed":
                            rounds_won[d]++;
                            highest_level[d] = Math.max(highest_level[d], parseInt(g.level));
                            break;
                        case "restart":
                            restarts[d]++;
                            break;
                        case "back to start menu":
                            break;
                        default:
                            deaths[d]++;
                    }

                }
                $scope.csv = '';
                var db = '';

                for (var dif = 0; dif < 3; dif++) {
                    $scope.csv += "difficulty: " + difficulty[dif] + '\n' +
                        "rounds_started: " + rounds_started[dif] + '\n' +
                        "rounds_won: " + rounds_won[dif] + '\n' +
                        "enemies_killed: " + enemies_killed[dif] + '\n' +
                        "coins_collected: " + coins_collected[dif] + '\n' +
                        "time_spend_game: " + time_spend_game[dif] + '\n' +
                        "highscore: " + highscore[dif] + '\n' +
                        "jumps: " + jumps[dif] + '\n' +
                        "restarts: " + restarts[dif] + '\n' +
                        "deaths: " + deaths[dif] + '\n' +
                        "highest_level: " + highest_level[dif] + '\n' +
                        "movement_inputs:" + movement_inputs[dif] + '\n' +
                        "eastereggs_found: " + eastereggs_found[dif] + '\n' +
                        "special_name: " + special_name[dif] + '\n' +
                        "overall_coins: " + overall_coins[dif] + '\n' +
                        "overall_eastereggs: " + overall_eastereggs[dif] + '\n' +
                        "overall_powerups: " + overall_powerups[dif] + '\n\n';
                    db += wrapForDB(rounds_started[dif], rounds_won[dif], enemies_killed[dif], coins_collected[dif], highscore[dif], time_spend_game[dif], jumps[dif], restarts[dif], '', deaths[dif], highest_level[dif], movement_inputs[dif], eastereggs_found[dif], special_name[dif]) + '\n';

                }
                $scope.csv = db + '\n' + $scope.csv;
            }

        }
    }

)();