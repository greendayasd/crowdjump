(function () {
        'use strict';

        angular
            .module('crowdjump.admin.controllers')
            .controller('AdminController', AdminController);

        AdminController.$inject = ['$scope', 'Authentication', 'Questionnaire', 'Ideas', 'Comments', 'History', 'Votes'];

        function AdminController($scope, Authentication, Questionnaire, Ideas, Comments, History, Votes) {
            var vm = this;
            vm.isAuthenticated = Authentication.isAuthenticated();
            vm.cookie = Authentication.getAuthenticatedAccount();
            vm.url = window.location.pathname;


            $scope.test = function () {
                console.log(vm.url);
            }

            //IE redirect
            if ((false || !!document.documentMode) && !vm.url.includes("oldbrowser")) {
                console.log("IE");
                window.location.href = '/oldbrowser';
            } else {
                //console.log(document.documentMode);
            }

            if (vm.url.includes("admin")) {
                get_pre();
                get_post();
                get_comments();
                get_versions();
            }

            $scope.createFile = function (text, name, type) {
                var dlcsv = document.getElementById("dlcsv");
                var file = new Blob([text], {type: type});
                dlcsv.href = URL.createObjectURL(file);
                dlcsv.download = name;
            };

            $scope.csv = '';

            function get_pre() {
                Questionnaire.all_pre().then(successFn, errorFn);

                function successFn(data, status, headers, config) {
                    $scope.PreSurvey = data.data;
                }

                function errorFn(data, status, headers, config) {
                }
            }

            function get_post() {
                Questionnaire.all_post().then(successFn, errorFn);

                function successFn(data, status, headers, config) {
                    $scope.PostSurvey = data.data;
                }

                function errorFn(data, status, headers, config) {
                }
            }

            function get_comments() {
                Comments.all().then(commentsSuccessFn, commentsErrorFn);

                function commentsSuccessFn(data, status, headers, config) {
                    $scope.comments = data.data;
                    get_ideavotes();
                }

                function commentsErrorFn(data, status, headers, config) {
                }
            }

            function get_ideavotes() {
                Votes.all().then(ideavotesSuccessFn, ideavotesErrorFn);

                function ideavotesSuccessFn(data, status, headers, config) {
                    $scope.ideavotes = data.data;
                    get_ideas();
                }

                function ideavotesErrorFn(data, status, headers, config) {
                }
            }

            function get_ideas() {
                Ideas.all().then(ideasSuccessFn, ideasErrorFn);

                $scope.$on('idea.created', function (event, idea) {
                    $scope.ideas.unshift(idea);
                });

                $scope.$on('idea.created.error', function () {
                    $scope.ideas.shift();
                });

                function ideasSuccessFn(data, status, headers, config) {
                    $scope.ideas_tmp = data.data;

                    //find own votes for ideas
                    $scope.ideas = $.map($scope.ideas_tmp, function (idea) {
                        var votes = $.grep($scope.ideavotes, function (ideavote) {
                            return ideavote.idea === idea.id;
                        })[0];
                        if (typeof vote !== 'undefined') {

                            // idea.votes.push(vote.vote);

                        } else {
                            // idea.uservote = 0;
                        }

                        var comments = $.grep($scope.comments, function (comment) {
                            return comment.idea === idea.id;
                        });

                        if (typeof comments !== 'undefined') {
                            // console.log(vote);
                            idea.comments = comments;

                        } else {
                            idea.comments = {'id': -1};
                        }

                        return idea;
                    });

                }

                function ideasErrorFn(data, status, headers, config) {
                    var msg = "Could not get ideas";
                    console.log(msg);
                }
            }

            function get_versions() {
                History.all().then(historySuccessFn, historyErrorFn);

                function historySuccessFn(data, status, headers, config) {
                    $scope.versions = data.data;
                    $scope.newestVersion = $scope.versions[0];

                }

                function historyErrorFn(data, status, headers, config) {
                    console.error(data.error);
                }
            }

            $scope.getCsv = function (name) {
                var header = '';
                var content = '';

                $scope.csv = '';

                if (name === "pre") {
                    header = 'id,user_id,';
                    var site1header = 'Age (Combobox),Gender (Combobox),Time in hours you use your PC per week (Combobox),Time in hours you play video games per week(Combobox),What are important aspects in a video game?(Checkbox)[0 Story/1 Graphic/2 Innovation/3 Multiplayer/4 Competition with other players/5 Difficulty/6 Gameplay],What are important aspects in a video game?(Checkbox)[Other],What is THE most important aspect in a video game?(Radiolist)[0 Story/1 Graphic/2 Innovation/3 Multiplayer/4 Competition with other players/5 Difficulty/6 Gameplay],What is THE most important aspect in a video game?(Radiolist)[Other],I played a lot of platformers (7 point scale),I like platformers (7 point scale),I like platformers more than other game genres (7 point scale),Have you ever designed a video game? (Bool),Have you ever designed an application? (except video games) (Bool),If you had the choice do want to be included in the design process of a video game? (Bool),How would you like to be included? (Text),Have you ever watched a "Twitch Plays" series (e.g. Twitch Plays Pokemon/ Twitch Plays Darksouls/ Twitch Plays Pubg/ etc) on Twitch? (Bool),Did you actively participate in the Twitch Plays series? (Bool), How did you like Twitch Plays? (7 point scale),Have you heard of “PleaseBeNice”? (Bool),Did you play PleaseBeNice yourself? (Bool),How did you like PleaseBeNice? (7 point scale),Did one of your ideas get implemented?(Bool)';
                    var site2header = 'A: I am really bad at video games B: I am extremely good in video games (Double 7 point scale),A: Only the design of a product is important B: Only functionality of a product is important (Double 7 point scale),A: I prefer to work alone B: I prefer to work with others (Double 7 point scale),A: Everyone\'s opinion should be heard equally B: The opinion of experts have a higher value (Double 7 point scale),A: I prefer very easy games B: I prefer very hard games (Double 7 point scale),A: I like to have a lot of freedom B: I prefer someone giving me tasks (Double 7 point scale),A: I prefer it when things don\'t change B: I prefer regular innovation (Double 7 point scale),A: I hate to compete with others B: I thrive on competition (Double 7 point scale),A: I see myself as a follower B: I see myself as a leader (Double 7 point scale),A: I love to discuss with others B: I prefer to not communicate with others at all (Double 7 point scale)';

                    for (var i = 0; i < $scope.PreSurvey.length; i++) {
                        content += '\n' + $scope.PreSurvey[i]["id"] + ',' + $scope.PreSurvey[i]["user"]["id"] + ',';

                        delete $scope.PreSurvey[i]["id"];
                        delete $scope.PreSurvey[i]["user"];
                        delete $scope.PreSurvey[i]["site0"];

                        var values = Object.keys($scope.PreSurvey[i]).map(function (key) {
                            return $scope.PreSurvey[i][key];
                        });
                        content += values;

                    }
                    header += site1header + ',' + site2header;
                }

                if (name === "post") {
                    header = 'id,user_id,';
                    var site2header = 'I felt challenged (GEQ 5 point scale),I felt pressured (GEQ 5 point scale),I felt frustrated (GEQ 5 point scale),I was fully occupied with the game (GEQ 5 point scale),I had to put a lot of effort into it (GEQ 5 point scale),It was asthetically pleasing (GEQ 5 point scale),I felt annoyed (GEQ 5 point scale),I found it impressive (GEQ 5 point scale),It felt like a rich experience (GEQ 5 point scale),I was deeply concentrated in the game (GEQ 5 point scale),I thought it was fun (GEQ 5 point scale),I felt succesful (GEQ 5 point scale),I felt irritable (GEQ 5 point scale),I was fast at reaching the game\'s targets (GEQ 5 point scale),I felt that I could explore things (GEQ 5 point scale),I felt skillful (GEQ 5 point scale),I found it tiresome (GEQ 5 point scale),I felt competent (GEQ 5 point scale),I forgot everything around me (GEQ 5 point scale),I felt bored (GEQ 5 point scale),I felt content (GEQ 5 point scale),I lost connection with the outside world (GEQ 5 point scale),I thought about other things (GEQ 5 point scale),I felt good (GEQ 5 point scale),I felt imaginative (GEQ 5 point scale),I felt time pressure (GEQ 5 point scale),It gave me a bad mood (GEQ 5 point scale),I felt happy (GEQ 5 point scale),I was good at it (GEQ 5 point scale),I lost track of time (GEQ 5 point scale),I was interested in the game\'s story (GEQ 5 point scale),I thought it was hard (GEQ 5 point scale),I enjoyed it (GEQ 5 point scale)';
                    var site3header = 'I found it enjoyable to be with the other(s) (SPGQ 5 point scale),I felt schadenfreude (malicious delight) (SPGQ 5 point scale),I envied the other(s) (SPGQ 5 point scale),I felt jealous of the other(s) (SPGQ 5 point scale),I paid close attention to the other(s) (SPGQ 5 point scale),The other(s) tended to ignore me (SPGQ 5 point scale),My intentions were clear to the other(s) (SPGQ 5 point scale),I felt revengeful (SPGQ 5 point scale),What I did affected what the other(s) did (SPGQ 5 point scale),The other(s) paid close attention to me (SPGQ 5 point scale),I felt connected to the other(s) (SPGQ 5 point scale),I admired the other(s) (SPGQ 5 point scale),My actions depended on the other’s actions (SPGQ 5 point scale),I tended to ignore the other(s) (SPGQ 5 point scale),What the other(s) did affected what I did (SPGQ 5 point scale),I empathized with the other(s) (SPGQ 5 point scale),I sympathized with the other(s) (SPGQ 5 point scale),When I was happy the others were happy (SPGQ 5 point scale),The other\'s actions were dependent on my actions (SPGQ 5 point scale),When the others were happy I was happy (SPGQ 5 point scale),The other’s intentions were clear to me (SPGQ 5 point scale)';
                    var site4header = 'I believe I had some choice about doing this activity (KIM/IMI 5 point scale),I thought Crowdjump was quite enjoyable (KIM/IMI 5 point scale),I am satisfied with my performance at Crowdjump (KIM/IMI 5 point scale),I was pretty skilled at Crowdjump (KIM/IMI 5 point scale),I felt pressured while doing Crowdjump (KIM/IMI 5 point scale),I think I am pretty good at this activity (KIM/IMI 5 point scale),I had concerns whether I could do the activity well (KIM/IMI 5 point scale),I was able to control the activity myself (KIM/IMI 5 point scale),I thought Crowdjump was a very interesting activity (KIM/IMI 5 point scale),Crowdjump was fun to do (KIM/IMI 5 point scale),I could choose how to proceed in Crowdjump (KIM/IMI 5 point scale),I felt very tense while doing Crowdjump (KIM/IMI 5 point scale)';
                    var site5header = 'I think that I would like to use this system frequently (SUS 5 point scale),I found the system unnecessarily complex (SUS 5 point scale),I thought the system was easy to use (SUS 5 point scale),I think that I would need the support of a technical person to be able to use this system (SUS 5 point scale),I found the various functions in this system were well integrated (SUS 5 point scale),I thought there was too much inconsistency in this system (SUS 5 point scale),I would imagine that most people would learn to use this system very quickly (SUS 5 point scale),I found the system very cumbersome to use (SUS 5 point scale),I felt very confident using the system (SUS 5 point scale),I needed to learn a lot of things before I could get going with this system (SUS 5 point scale)';
                    var site6header = 'I liked the idea of Crowdjump (5 point scale),I liked to submit new ideas (5 point scale),The game developed in a positive direction (5 point scale),The website developed in a positive direction (5 point scale),The process of choosing the ideas developed in a positive direction (5 point scale),After each submission cycle the features were implemented as requested (5 point scale),The implemented features met my wishes for Crowdjump (5 point scale),I formed a community with other players (5 point scale),Other players interfered with the development (5 point scale),The other players and I worked as a team (5 point scale),My opinion was not heard (5 point scale)';

                    $scope.PostSurvey2 = $scope.PostSurvey;
                    for (var i = 0; i < $scope.PostSurvey2.length; i++) {
                        content += '\n' + $scope.PostSurvey2[i]["id"] + ',' + $scope.PostSurvey2[i]["user"]["id"] + ',';

                        delete $scope.PostSurvey2[i]["id"];
                        delete $scope.PostSurvey2[i]["user"];
                        delete $scope.PostSurvey2[i]["site0"];

                        var values = Object.keys($scope.PostSurvey2[i]).map(function (key) {
                            return $scope.PostSurvey2[i][key];
                        });
                        content += values;

                    }


                    header += site2header + ',' + site3header + ',' + site4header + ',' + site5header + ',' + site6header;

                }

                if (name === "active_ideacomments") {
                    header = 'id,user_id,title,description';
                    for (var i = 0; i < $scope.ideas.length; i++) {
                        if ($scope.ideas[i].deleted == true) continue;
                        content += '\n' + $scope.ideas[i].id + ',' + $scope.ideas[i].user.id + ',' + $scope.ideas[i].request_text + ',' + $scope.ideas[i].description + ',';
                        for (var j = 0; j < $scope.ideas[i].comments.length; j++) {
                            if ($scope.ideas[i].comments[j].deleted == true) continue;
                            content += '\n' + $scope.ideas[i].comments[j].id + ',' + $scope.ideas[i].comments[j].user.id + ',' + ',' + $scope.ideas[i].comments[j].text + ',';
                        }
                        content += '\n';
                    }

                }

                if (name === "all_ideacomments") {
                    header = 'id,user_id,title,description';
                    for (var i = 0; i < $scope.ideas.length; i++) {
                        content += '\n' + $scope.ideas[i].id + ',' + $scope.ideas[i].user.id + ',' + $scope.ideas[i].request_text + ',' + $scope.ideas[i].description + ','
                        for (var j = 0; j < $scope.ideas[i].comments.length; j++) {
                            content += '\n' + $scope.ideas[i].comments[j].id + ',' + $scope.ideas[i].comments[j].user.id + ',' + ',' + $scope.ideas[i].comments[j].text + ','
                        }
                        content += '\n';
                    }
                }


                if (name === "implemented_ideas") {
                    var orderedByUser = Object.values(groupBy($scope.ideas, 'user'));
                    console.log(orderedByUser);
                    header = 'id,user_id,title,description';
                    for (var i = 0; i < $scope.ideas.length; i++) {
                        if ($scope.ideas[i].deleted == true) continue;
                        if ($scope.ideas[i].implemented == false) continue;
                        content += '\n' + $scope.ideas[i].id + ',' + $scope.ideas[i].user.id + ',' + $scope.ideas[i].request_text + ',' + $scope.ideas[i].description + ',';
                    }


                }

                $scope.csv += header + content;
                setTimeout($scope.createFile($scope.csv, name + '.csv', 'text/csv'));
            }

            $scope.getQuestionnaire = function (questionnaire) {
                var header = '';
                var content = '';
                $scope.csv = '';

                header = 'id,user_id,';

                switch (questionnaire) {
                    case "geq":
                        header += 'Competence, Sensory and Imaginative Immersion, Flow, Tension/Annoyance, Challenge, Negative affect, Positive affect';
                        break;
                    case "sus":
                        header += 'SUS Score';
                        break;
                    case "spgq":
                        header += 'Empathy, Negative feelings, Behavioural engagement';
                        break;
                    case "kim":
                        header += 'Enjoyment, Perceived Competence, Perceived Choice, Pressure/Tension';
                        break;
                    default:
                }

                for (var i = 0; i < $scope.PostSurvey.length; i++) {
                    content += '\n' + $scope.PostSurvey[i]["id"] + ',' + $scope.PostSurvey[i]["user"]["id"] + ',';
                    var competence = 0,
                        sensory = 0,
                        flow = 0,
                        tension = 0,
                        challenge = 0,
                        negative = 0,
                        positive = 0,
                        pressure = 0,
                        enjoyment = 0,
                        freedomOfChoice = 0,
                        empathy = 0,
                        negativefeelings = 0,
                        behavioural = 0;

                    switch (questionnaire) {
                        case "geq":
                            for (var j = 0; j <= 32; j++) {
                                var row = "GEQ";

                                j < 10 ? row += '0' + j : row += j;
                                var value = parseInt($scope.PostSurvey[i][row]);

                                //new mapped!
                                switch (j + 1) {
                                    case 16:
                                    case 18:
                                    case 29:
                                    case 12:
                                    case 14: //Competence
                                        competence += value;
                                        // log("Competence", j, value, competence, i);
                                        break;
                                    case 31:
                                    case 6:
                                    case 25:
                                    case 15:
                                    case 8:
                                    case 9:
                                        sensory += value;
                                        break;
                                    case 4:
                                    case 19:
                                    case 30:
                                    case 10:
                                    case 12:
                                        flow += value;
                                        break;
                                    case 7:
                                    case 13:
                                    case 3:
                                        tension += value;
                                        break;
                                    case 32:
                                    case 1:
                                    case 1:
                                    case 26:
                                    case 5:
                                        challenge += value;
                                        break;
                                    case 27:
                                    case 23:
                                    case 17:
                                    case 20:
                                        negative += value;
                                        break;
                                    case 21:
                                    case 11:
                                    case 28:
                                    case 24:
                                    case 33:
                                        positive += value;
                                        break;
                                    default:
                                        console.log(j);
                                }
                                // log(row, $scope.PostSurvey[i][row]);
                            }
                            content += competence + ',' + sensory + ',' + flow + ',' + tension + ',' + challenge + ',' + negative + ',' + positive;
                            break;
                        case "kim":
                            for (var j = 0; j <= 11; j++) {
                                var row = "KIM";

                                j < 10 ? row += '0' + j : row += j;
                                var value = parseInt($scope.PostSurvey[i][row]) - 1;

                                //new mapped!
                                switch (j + 1) {
                                    case 2:
                                    case 9:
                                    case 10:
                                        enjoyment += value;
                                        break;
                                    case 3:
                                    case 4:
                                    case 6:
                                        competence += value;
                                        break;
                                    case 1:
                                    case 8:
                                    case 11:
                                        freedomOfChoice += value;
                                        break;
                                    case 5:
                                    case 7:
                                    case 12:
                                        pressure += value;
                                        break;
                                    default:
                                        console.log(j);
                                }
                                // log(row, $scope.PostSurvey[i][row]);
                            }
                            content += enjoyment + ',' + competence + ',' + freedomOfChoice + ',' + pressure;
                            break;
                        case "spgq":
                            for (var j = 0; j <= 20; j++) {
                                var row = "SPGQ";

                                j < 10 ? row += '0' + j : row += j;
                                var value = parseInt($scope.PostSurvey[i][row]);

                                //new mapped!
                                switch (j + 1) {
                                    case 20:
                                    case 18:
                                    case 16:
                                    case 11:
                                    case 12:
                                    case 1:
                                    case 17:
                                        empathy += value;
                                        break;
                                    case 14:
                                    case 6:
                                    case 8:
                                    case 2:
                                    case 4:
                                    case 3:
                                        negativefeelings += value;
                                        break;
                                    case 13:
                                    case 19:
                                    case 15:
                                    case 9:
                                    case 10:
                                    case 5:
                                    case 7:
                                    case 21:
                                        behavioural += value;
                                        break;
                                    default:
                                        console.log(j);
                                }
                                // log(row, $scope.PostSurvey[i][row]);
                            }
                            content += empathy + ',' + negativefeelings + ',' + behavioural;
                            break;
                        case "sus":
                            var score = 0;
                            for (var j = 0; j <= 9; j++) {
                                var row = "SUS";
                                j < 10 ? row += '0' + j : row += j;
                                var value = $scope.PostSurvey[i][row];
                                j % 2 == 0 ? score += value - 1 : score += (5 - value);
                                // log(row,$scope.PostSurvey[i][row], score);
                            }
                            content += score * 2.5;
                            break;
                        default:
                            console.log(questionnaire)
                    }
                    // console.log($scope.PostSurvey[i]);
                }


                $scope.csv += header + content;
                setTimeout($scope.createFile($scope.csv, questionnaire + '.csv', 'text/csv'));

            }

            $scope.get_tracking_user = function (username, grouped) {
                var header = '';
                var content = '';
                var data = {"username": username};

                $.ajax({
                    url: '/gettracking/',
                    data: data,
                    success: function (data) {

                        if (grouped) {
                            header = 'page,time,count';
                            var orderedByPage = Object.values(groupBy(data, 'page'));

                            for (var i = 0; i < orderedByPage.length; i++) {
                                orderedByPage[i] = (orderedByPage[i][0]["page"] + ',' + sumUp(orderedByPage[i], "time") + ',' + orderedByPage[i].length + ',');
                                content += '\n' + orderedByPage[i];

                            }
                        } else {
                            header = 'timestamp,lastpage,page,time,';
                            for (var i = 0; i < data.length; i++) {
                                content += '\n' + data[i].timestamp + ',' + data[i].lastpage + ',' + data[i].page + ',' + data[i].time + ',';
                            }
                        }
                        $scope.csv = header + content;
                    },
                    error: function (data) {
                        console.log("not found?");
                    }
                });

                setTimeout($scope.createFile($scope.csv, username + '.csv', 'text/csv'));

            }

            $scope.get_tracking_all = function (grouped) {

                //ajax get all user files
                var header = '';
                var content = '';
                var data = {};

                $.ajax({
                    url: '/getalltracking/',
                    data: data,
                    success: function (data) {
                        // console.log(data);
                        if (grouped) {
                            header = 'page,time,';
                            var orderedByPage = Object.values(groupBy(data, 'page'));

                            for (var i = 0; i < orderedByPage.length; i++) {
                                orderedByPage[i] = (orderedByPage[i][0]["page"] + ',' + sumUp(orderedByPage[i], "time") + ',');
                                content += '\n' + orderedByPage[i];

                            }
                        } else {
                            header = 'timestamp,lastpage,page,time,';
                            for (var i = 0; i < data.length; i++) {
                                content += '\n' + data[i].timestamp + ',' + data[i].lastpage + ',' + data[i].page + ',' + data[i].time + ',';
                            }
                        }
                        $scope.csv = header + content;
                    },
                    error: function (data) {
                        console.log("not found?");
                    }
                });

                setTimeout($scope.createFile($scope.csv, 'all_tracking.csv', 'text/csv'));

            }

            $scope.get_gamedata_user = function (username, grouped, time) {
                var header = '';
                var content = '';
                // username = 'admin';
                // console.log(username);
                var data = {"username": username, "version": $scope.newestVersion.label};
                $.ajax({
                    url: '/getgamedata/',
                    data: data,
                    success: function (data) {

                        if (time) {
                            header = 'level,time,count';
                            var orderedByLevel = Object.values(groupBy(data, 'level'));
                            console.log(orderedByLevel);
                            for (var i = 0; i < orderedByLevel.length; i++) {
                                var time_sum = 0;
                                var count = 0;
                                for (var j = 0; j < orderedByLevel[i].length; j++) {
                                    if (orderedByLevel[i][j]["status"] == "completed") {
                                        time_sum += parseInt(orderedByLevel[i][j]["time"]);
                                        count++;
                                    }
                                }
                                content += '\n' + orderedByLevel[i][0].level + ',' + time_sum + ',' + count + ',';
                            }

                        }
                        else if (grouped) {
                            header = 'level,status,count';
                            var orderedByLevel = Object.values(groupBy(data, 'level'));
                            var orderedByLevelAndStatus = [];
                            for (var i = 0; i < orderedByLevel.length; i++) {
                                orderedByLevelAndStatus.push(Object.values(groupBy(orderedByLevel[i], 'status')));
                                // console.log(orderedByLevelAndStatus);
                            }

                            for (var i = 0; i < orderedByLevelAndStatus.length; i++) {
                                for (var j = 0; j < orderedByLevelAndStatus[i].length; j++) {
                                    // console.log(orderedByLevelAndStatus[i][j]);
                                    content += '\n' + orderedByLevelAndStatus[i][j][0]["level"] + ',' + orderedByLevelAndStatus[i][j][0]["status"] + ',' + orderedByLevelAndStatus[i][j].length;
                                }
                            }
                        } else {
                            header = 'timestamp,level,status,time,jumps,movement_inputs,';
                            for (var i = 0; i < data.length; i++) {
                                content += '\n' + data[i].timestamp + ',' + data[i].level + ',' + data[i].status + ',' + data[i].time + ',' + data[i].jumps + ',' + data[i].movement_inputs + ',';
                            }
                            // console.log(data);
                        }
                        $scope.csv = header + content;
                    },
                    error: function (data) {
                        console.log("not found?" + JSON.stringify(data));
                    }
                });

                setTimeout($scope.createFile($scope.csv, username + '.csv', 'text/csv'));

            };

            $scope.get_all_gamedata_user = function (username, grouped, all, time) {
                var header = '';
                var content = '';
                var data = all ? {"username": username, "version": 0} : {
                    "username": username,
                    "version": $scope.newestVersion.label
                };

                $.ajax({
                    url: '/getallgamedatauser/',
                    data: data,
                    success: function (data) {
                        if (data[1] == 'failure') console.log(data);
                        // console.log(data);
                        // console.log(data);


                        if (time) {
                            header = 'level,time,count';
                            var orderedByLevel = Object.values(groupBy(data, 'level'));
                            for (var i = 0; i < orderedByLevel.length; i++) {
                                var time_sum = 0;
                                var count = 0;
                                for (var j = 0; j < orderedByLevel[i].length; j++) {
                                    if (orderedByLevel[i][j]["status"] == "completed") {
                                        time_sum += parseInt(orderedByLevel[i][j]["time"]);
                                        count++;
                                    }
                                }
                                content += '\n' + orderedByLevel[i][0].level + ',' + time_sum + ',' + count + ',';
                            }

                        }
                        else if (grouped) {
                            header = 'level,status,count';
                            var orderedByLevel = Object.values(groupBy(data, 'level'));
                            var orderedByLevelAndStatus = [];
                            for (var i = 0; i < orderedByLevel.length; i++) {
                                orderedByLevelAndStatus.push(Object.values(groupBy(orderedByLevel[i], 'status')));
                            }

                            for (var i = 0; i < orderedByLevelAndStatus.length; i++) {
                                for (var j = 0; j < orderedByLevelAndStatus[i].length; j++) {
                                    content += '\n' + orderedByLevelAndStatus[i][j][0]["level"] + ',' + orderedByLevelAndStatus[i][j][0]["status"] + ',' + orderedByLevelAndStatus[i][j].length;
                                }
                            }
                        } else {
                            header = 'timestamp,level,status,time,jumps,movement_inputs,';
                            for (var i = 0; i < data.length; i++) {
                                content += '\n' + data[i].timestamp + ',' + data[i].level + ',' + data[i].status + ',' + data[i].time + ',' + data[i].jumps + ',' + data[i].movement_inputs + ',';
                            }
                        }
                        $scope.csv = header + content;
                    },
                    error: function (data) {
                        console.log("not found?" + JSON.stringify(data));
                    }
                });
                if (all) {
                    setTimeout($scope.createFile($scope.csv, "gamedata_all.csv", 'text/csv'));
                } else {
                    setTimeout($scope.createFile($scope.csv, "gamedata" + $scope.newestVersion.label + '.csv', 'text/csv'));
                }

            };

            $scope.get_all_gamedata = function (grouped, all, time) {
                var header = '';
                var content = '';
                var data = all ? {"version": 0} : {"version": $scope.newestVersion.label};

                $.ajax({
                    url: '/getallgamedata/',
                    data: data,
                    success: function (data) {
                        if (data[1] == 'failure') console.log(data);

                        if (time) {
                            header = 'level,time,count';
                            var orderedByLevel = Object.values(groupBy(data, 'level'));
                            for (var i = 0; i < orderedByLevel.length; i++) {
                                var time_sum = 0;
                                var count = 0;
                                for (var j = 0; j < orderedByLevel[i].length; j++) {
                                    if (orderedByLevel[i][j]["status"] == "completed") {
                                        time_sum += parseInt(orderedByLevel[i][j]["time"]);
                                        count++;
                                    }
                                }
                                content += '\n' + orderedByLevel[i][0].level + ',' + time_sum + ',' + count + ',';
                            }

                        }
                        else if (grouped) {
                            header = 'level,status,count';
                            var orderedByLevel = Object.values(groupBy(data, 'level'));
                            var orderedByLevelAndStatus = [];
                            for (var i = 0; i < orderedByLevel.length; i++) {
                                orderedByLevelAndStatus.push(Object.values(groupBy(orderedByLevel[i], 'status')));
                            }

                            for (var i = 0; i < orderedByLevelAndStatus.length; i++) {
                                for (var j = 0; j < orderedByLevelAndStatus[i].length; j++) {
                                    content += '\n' + orderedByLevelAndStatus[i][j][0]["level"] + ',' + orderedByLevelAndStatus[i][j][0]["status"] + ',' + orderedByLevelAndStatus[i][j].length;
                                }
                            }
                        } else {
                            header = 'timestamp,level,status,time,jumps,movement_inputs,';
                            for (var i = 0; i < data.length; i++) {
                                content += '\n' + data[i].timestamp + ',' + data[i].level + ',' + data[i].status + ',' + data[i].time + ',' + data[i].jumps + ',' + data[i].movement_inputs + ',';
                            }
                        }
                        $scope.csv = header + content;
                    },
                    error: function (data) {
                        console.log("not found?" + JSON.stringify(data));
                    }
                });
                if (all) {
                    setTimeout($scope.createFile($scope.csv, "gamedata_all.csv", 'text/csv'));
                } else {
                    setTimeout($scope.createFile($scope.csv, "gamedata" + $scope.newestVersion.label + '.csv', 'text/csv'));
                }

            };

            $scope.get_all_game_user_version = function () {
                var data = {"version": $scope.newestVersion.label};
                $scope.csv = '';

                $.ajax({
                    url: '/getallusergame/',
                    data: data,
                    success: function (data) {
                        for (var i = 0; i < data.length; i++) {
                            $scope.csv += data[i] + "\n";
                        }
                    },
                    error: function (data) {
                        console.log("not found?" + JSON.stringify(data));
                    }
                });

            }

            $scope.checkIdeas = function () {
                $scope.csv = '';

                for (var i = 0; i < $scope.ideas.length; i++) {
                    var upvotes = 0;
                    var downvotes = 0;
                }
            }

            $scope.send_mail = function () {
                var data = {};
                $.ajax({
                    url: '/sendmail/',
                    data: data,
                    success: function (data) {
                    },
                    error: function (data) {
                    }
                });
            }
            $scope.get_idea_list = function () {
                var list = '';
                for (var i = 0; i < $scope.ideas.length; i++) {
                    if ($scope.ideas[i].deleted == true || $scope.ideas[i].implemented == true || $scope.ideas[i].not_feasible == true) continue;
                    if (i >= 1) list += '\n';
                    list += $scope.ideas[i].id;
                }
                $scope.csv = list;
            }

            $scope.getNumber = function (num) {
                return new Array(num);
            }

            $scope.level_json = function () {
                var data = $scope.csv.replaceAll("this.add.sprite", "");

                //remove first 35 lines
                // data.split("\n").slice(37).join("\n");
                // console.log(data);
                var lines = data.split('\n');
                lines.splice(0, 35);
                lines.splice(lines.length-7, lines.length-1);
                data = lines.join('\n');


                //replace function
                var levelstring1 = 'Level';
                var levelstring2 = '.prototype.create = function ';
                data = data.replaceAll(levelstring1 + levelstring2, "");

                for (var levelid = 0; levelid < 9; levelid++) {
                    data = data.replaceAll(levelstring1 + levelid + levelstring2, "");
                }
                data = data.replaceAll("};", "");

                //replace tabs and linebreaks
                // data = data.replaceAll(";\n", ",");
                data = data.replaceAll("\t", "");
                data = data.replaceAll(";", "");
                data = data.replaceAll("'", "\"");

                //convert to array
                data = data.replaceAll(/\(/, "[");
                data = data.replaceAll(/\)/, "]");


                //cut of paranthesis at the beginning and comma/line breaks at the end
                data = data.substring(6, data.length);
                // data = data.substring(0, data.length -25);
                // log(data);

                // var string_unfinished = true;
                // var maxcount = 10;
                // while (string_unfinished) {
                //     var last_char = data.substring(data.length - 1, data.length);
                //     last_char == "]" ? string_unfinished = false : data = data.substring(0, data.length - 1);
                //     maxcount--;
                //     maxcount == 0 ? string_unfinished = true : maxcount;
                //
                // }

                var objects = data.split('\n\n');

                // var array = JSON.parse("[" + data + "]");
                var platforms = '';
                var falling_platforms = '';
                var fakeplatforms = '';
                var crates = '';
                var lava = '';
                var spikes = '';
                var sawblades = '';
                var flags = '';
                var coins = '';
                var hero = '';
                var powerups = '';
                var deco = '';
                var enemies = '';
                var enemy_walls = '';
                var eastereggs = '';
                var cannons = '';
                var buttons = '';
                var gates = '';
                var spawns = '';

                var maxX = 918;
                var maxY = 588;

                for (var i = 0; i < objects.length; i++) {
                    var line = objects[i];
                    var angle = 0.0;
                    var scalex = 1.0;
                    var scaley = 1.0;
                    //multiple arguments
                    if (line.startsWith("var")) {
                        //get arguments
                        var argumentArr = line.split('\n');
                        line = '[' + argumentArr[0].split('[')[1];

                        for (var count = 1; count < argumentArr.length; count++) {
                            var def = argumentArr[count].split('.')[1];
                            if (def.startsWith("angle")) {
                                angle = argumentArr[count].split(' ')[2];
                                angle = angle.substring(0, angle.length - 2);
                                log(angle);
                            }
                            if (def.startsWith("scale")) {
                                var scales = argumentArr[count].split("[")[1];
                                scales = scales.substring(0, scales.length - 1).split(', ');
                                scalex = scales[0];
                                scaley = scales[1];
                            }
                        }
                    }
                    line = JSON.parse(line);
                    var image = line[2];
                    var split = image.split(":");
                    var type = split[1];
                    var fulltype = ', "type":"' + split[1] + '"';
                    var standartOptions = ', "angle":' + angle +  ', "scalex":' + scalex + ', "scaley":' + scaley;
                    var endline = '},\n';

                    maxX = Math.max(maxX, line[0]);
                    maxY = Math.max(maxY, line[1]);
                    var line = '\t\t{"image": ' + '"' + image + '", "x": ' + line[0] + ', "y": ' + line[1] + standartOptions;
                    if (image.startsWith("lava")) {
                        lava += line + endline;
                        continue;
                    }
                    if (image.startsWith("spike")) {
                        spikes += line + endline;
                        continue;
                    }
                    if (image.startsWith("crate")) {
                        crates += line + endline;
                        continue;
                    }
                    if (image.startsWith("falling")) {
                        falling_platforms += line + endline;
                        continue;
                    }
                    if (image.startsWith("flag")) {
                        flags += line + endline;
                        continue;
                    }
                    if (image.startsWith("coin")) {
                        coins += line + endline;
                        continue;
                    }
                    if (image.startsWith("hero")) {
                        hero += line + endline;
                        continue;
                    }
                    if (image.startsWith("powerup")) {
                        powerups += line + fulltype + endline;
                        continue;
                    }
                    if (image.startsWith("easteregg")) {
                        eastereggs += line + fulltype + endline;
                        continue;
                    }
                    if (image.startsWith("deco")) {
                        deco += line + fulltype + endline;
                        continue;
                    }
                    if (image.startsWith("enemy")) {
                        enemies += line + fulltype + endline;
                        continue;
                    }
                    if (image.startsWith("invisible_wall")) {
                        enemy_walls += line + endline;
                        continue;
                    }

                    if (image.startsWith("sawblade")) {
                        sawblades += line + ', "speed": 100, "orientation": "UP", "base": "sawblade_base"' + endline;
                        continue;
                    }

                    if (image.startsWith("cannon")) {
                        cannons += line + ', "ballpos":"0"' + endline;
                        continue;
                    }

                    if (image.startsWith("button")) {
                        var default_buttonnr = 0;
                        if (image.startsWith("buttonBlue")) default_buttonnr = 1;
                        if (image.startsWith("buttonGreen")) default_buttonnr = 2;
                        buttons += line + ', "buttonnr":' + default_buttonnr + endline;
                        continue;
                    }

                    if (image.startsWith("gate")) {
                        var default_buttonnr = 0;
                        if (image.startsWith("gateBlue")) default_buttonnr = 1;
                        if (image.startsWith("gateGreen")) default_buttonnr = 2;
                        gates += line + ', "needs_buttonnr":' + default_buttonnr + endline;
                        continue;
                    }

                    if (image.startsWith("spawn")) {
                        var default_buttonnr = 0;
                        if (image.startsWith("spawnBlue")) default_buttonnr = 1;
                        spawns += line + ', "p_types": "' + type + '", "xmove": 0, "ymove": 0, "minx": 0, "miny": 0, "maxx": 0, "maxy": 0' + ', "needs_buttonnr":' + default_buttonnr + endline;
                        continue;
                    }

                    if (image.startsWith("fake")) {
                        fakeplatforms += line + ', "p_types": "' + type + '", "xmove": 0, "ymove": 0, "minx": 0, "miny": 0, "maxx": 0, "maxy": 0' + endline;
                        continue;
                    }
                    if (image.startsWith("bounce")) {
                        type = 'bouncing';
                        platforms += line + ', "p_types": "' + type + '", "xmove": 0, "ymove": 0, "minx": 0, "miny": 0, "maxx": 0, "maxy": 0' + endline;
                        continue;
                    }
                    if (image.startsWith("lavaground")) {
                        type = 'lavaswitch';
                        platforms += line + ', "p_types": "' + type + '", "xmove": 0, "ymove": 0, "minx": 0, "miny": 0, "maxx": 0, "maxy": 0' + endline;
                        continue;
                    }
                    if (image.startsWith("ice")) {
                        type = 'slippery';
                        platforms += line + ', "p_types": "' + type + '", "xmove": 0, "ymove": 0, "minx": 0, "miny": 0, "maxx": 0, "maxy": 0' + endline;
                        continue;
                    }
                    if (image.startsWith("conveyor_l")) {
                        type = 'con_l';
                        platforms += line + ', "p_types": "' + type + '", "xmove": 0, "ymove": 0, "minx": 0, "miny": 0, "maxx": 0, "maxy": 0' + endline;
                        continue;
                    }
                    if (image.startsWith("conveyor_r")) {
                        type = 'con_r';
                        platforms += line + ', "p_types": "' + type + '", "xmove": 0, "ymove": 0, "minx": 0, "miny": 0, "maxx": 0, "maxy": 0' + endline;
                        continue;
                    }
                    platforms += line + ', "p_types": "", "xmove": 0, "ymove": 0, "minx": 0, "miny": 0, "maxx": 0, "maxy": 0' + endline;

                }

                //old convertions
                // for (var i = 0; i < array.length; i++) {
                //     var image = array[i][2];
                //     var split = image.split(":");
                //     var type = split[1];
                //     var fulltype = ', "type":"' + split[1] + '"';
                //     var endline = '},\n';
                //
                //     maxX = Math.max(maxX, array[i][0]);
                //     maxY = Math.max(maxY, array[i][1]);
                //     var line = '\t\t{"image": ' + '"' + image + '", "x": ' + array[i][0] + ', "y": ' + array[i][1];
                //     if (image.startsWith("lava")) {
                //         lava += line + endline;
                //         continue;
                //     }
                //     if (image.startsWith("spike")) {
                //         spikes += line + endline;
                //         continue;
                //     }
                //     if (image.startsWith("crate")) {
                //         crates += line + endline;
                //         continue;
                //     }
                //     if (image.startsWith("falling")) {
                //         falling_platforms += line + endline;
                //         continue;
                //     }
                //     if (image.startsWith("flag")) {
                //         flags += line + endline;
                //         continue;
                //     }
                //     if (image.startsWith("coin")) {
                //         coins += line + endline;
                //         continue;
                //     }
                //     if (image.startsWith("hero")) {
                //         hero += line + endline;
                //         continue;
                //     }
                //     if (image.startsWith("powerup")) {
                //         powerups += line + fulltype + endline;
                //         continue;
                //     }
                //     if (image.startsWith("easteregg")) {
                //         eastereggs += line + fulltype + endline;
                //         continue;
                //     }
                //     if (image.startsWith("deco")) {
                //         decorations += line + fulltype + endline;
                //         continue;
                //     }
                //     if (image.startsWith("enemy")) {
                //         enemies += line + fulltype + endline;
                //         continue;
                //     }
                //     if (image.startsWith("invisible_wall")) {
                //         enemy_walls += line + endline;
                //         continue;
                //     }
                //
                //     if (image.startsWith("sawblade")) {
                //         sawblades += line + ', "speed": 100, "orientation": "UP", "base": "sawblade_base"' + endline;
                //         continue;
                //     }
                //
                //     if (image.startsWith("cannon")) {
                //         cannons += line + ', "ballpos":"0"' + endline;
                //         continue;
                //     }
                //
                //     if (image.startsWith("fake")) {
                //         fakeplatforms += line + ', "p_types": "' + type + '", "xmove": 0, "ymove": 0, "minx": 0, "miny": 0, "maxx": 0, "maxy": 0' + endline;
                //         continue;
                //     }
                //     if (image.startsWith("bounce")) {
                //         type = 'bouncing';
                //         platforms += line + ', "p_types": "' + type + '", "xmove": 0, "ymove": 0, "minx": 0, "miny": 0, "maxx": 0, "maxy": 0' + endline;
                //         continue;
                //     }
                //     if (image.startsWith("lavaground")) {
                //         type = 'lavaswitch';
                //         platforms += line + ', "p_types": "' + type + '", "xmove": 0, "ymove": 0, "minx": 0, "miny": 0, "maxx": 0, "maxy": 0' + endline;
                //         continue;
                //     }
                //     if (image.startsWith("ice")) {
                //         type = 'slippery';
                //         platforms += line + ', "p_types": "' + type + '", "xmove": 0, "ymove": 0, "minx": 0, "miny": 0, "maxx": 0, "maxy": 0' + endline;
                //         continue;
                //     }
                //     if (image.startsWith("conveyor_l")) {
                //         type = 'con_l';
                //         platforms += line + ', "p_types": "' + type + '", "xmove": 0, "ymove": 0, "minx": 0, "miny": 0, "maxx": 0, "maxy": 0' + endline;
                //         continue;
                //     }
                //     if (image.startsWith("conveyor_r")) {
                //         type = 'con_r';
                //         platforms += line + ', "p_types": "' + type + '", "xmove": 0, "ymove": 0, "minx": 0, "miny": 0, "maxx": 0, "maxy": 0' + endline;
                //         continue;
                //     }
                //     platforms += line + ', "p_types": "", "xmove": 0, "ymove": 0, "minx": 0, "miny": 0, "maxx": 0, "maxy": 0' + endline;
                // }

                var worldsize = '\t"size": {"x": ' + (maxX + 42) + ', "y": ' + (maxY + 12) + '}';

                platforms = wrapJsonLevel(platforms, "platforms");
                falling_platforms = wrapJsonLevel(falling_platforms, "fallingPlatforms");
                fakeplatforms = wrapJsonLevel(fakeplatforms, "fakePlatforms");

                crates = wrapJsonLevel(crates, "crates");
                buttons = wrapJsonLevel(buttons, "buttons");
                gates = wrapJsonLevel(gates, "gates");
                spawns = wrapJsonLevel(spawns, "spawns");

                coins = wrapJsonLevel(coins, "coins");
                powerups = wrapJsonLevel(powerups, "powerups");
                eastereggs = wrapJsonLevel(eastereggs, "eastereggs");

                lava = wrapJsonLevel(lava, "lava");
                spikes = wrapJsonLevel(spikes, "spikes");
                sawblades = wrapJsonLevel(sawblades, "sawblades");
                cannons = wrapJsonLevel(cannons, "cannons");

                enemies = wrapJsonLevel(enemies, "enemies");
                enemy_walls = wrapJsonLevel(enemy_walls, "enemyWalls");

                flags = wrapJsonLevel(flags, "flags");
                hero = '\t"hero":\n' + hero + '';

                deco = wrapJsonLevel(deco, "deco");

                $scope.csv = '{\n' + platforms + falling_platforms + fakeplatforms;
                $scope.csv += crates + buttons + gates + spawns;
                $scope.csv += coins + powerups + eastereggs;
                $scope.csv += lava + spikes + sawblades + cannons;
                $scope.csv += enemies + enemy_walls;
                $scope.csv += flags + hero + deco + worldsize + '\n}';

            }

            function randomize(array) {
                var currentIndex = array.length, temporaryValue, randomIndex;
                var ordering = [];
                for (var i = 0; i < array.length; i++) {
                    ordering.push(i);
                }

                // While there remain elements to shuffle...
                while (0 !== currentIndex) {

                    // Pick a remaining element...
                    randomIndex = Math.floor(Math.random() * currentIndex);
                    currentIndex -= 1;

                    // And swap it with the current element.
                    temporaryValue = array[currentIndex];
                    array[currentIndex] = array[randomIndex];
                    array[randomIndex] = temporaryValue;

                    temporaryValue = ordering[currentIndex];
                    ordering[currentIndex] = ordering[randomIndex];
                    ordering[randomIndex] = temporaryValue;
                }

                return [array, ordering];
            }

            //to get the randomized questions in the right order again
            function doubleSortArray(array, ordering) {
                //1) combine the arrays:
                var list = [];
                var res = [];
                for (var j = 0; j < ordering.length; j++)
                    list.push({'id': ordering[j], 'value': array[j]});

                //2) sort:
                list.sort(function (a, b) {
                    return ((a.id < b.id) ? -1 : ((a.id == b.id) ? 0 : 1));
                });

                //3) separate them back out:
                for (var k = 0; k < list.length; k++) {
                    res.push(list[k].value);
                }
                return res;
            }

            //for csv convert
            var groupBy = function (xs, key) {
                return xs.reduce(function (rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            };

            var sumUp = function (xs, key) {
                var initialValue = '00:00:00';
                return xs.reduce(function (sum, x) {
                    return addTimes(sum, x[key]);
                }, initialValue);
            };

            var sumKey = function (xs, key) {
                var res = 0;
                return xs.reduce(function (sum, x) {
                    return addTimes(sum, x[key]);
                }, res);

            }

            function addTimes(startTime, endTime) {
                var times = [0, 0, 0]
                var max = times.length

                var a = (startTime || '').split(':')
                var b = (endTime || '').split(':')

                // normalize time values
                for (var i = 0; i < max; i++) {
                    a[i] = isNaN(parseInt(a[i])) ? 0 : parseInt(a[i])
                    b[i] = isNaN(parseInt(b[i])) ? 0 : parseInt(b[i])
                }

                // store time values
                for (var i = 0; i < max; i++) {
                    times[i] = a[i] + b[i]
                }

                var hours = times[0]
                var minutes = times[1]
                var seconds = times[2]

                if (seconds >= 60) {
                    var m = (seconds / 60) << 0
                    minutes += m
                    seconds -= 60 * m
                }

                if (minutes >= 60) {
                    var h = (minutes / 60) << 0
                    hours += h
                    minutes -= 60 * h
                }

                return ('0' + hours).slice(-2) + ':' + ('0' + minutes).slice(-2) + ':' + ('0' + seconds).slice(-2)
            }

            function parseTuple(t) {
                var items = t.replace(/^\(|\)$/g, "").split("),(");
                items.forEach(function (val, index, array) {
                    array[index] = val.split(",").map(Number);
                });
                return items;
            }

            function wrapJsonLevel(string, key) {
                string = string.substring(0, string.length - 2);
                return '\t"' + key + '": [\n' + string + '\n\t],\n';
            }

            String.prototype.replaceAll = function (search, replacement) {
                var target = this;
                return target.replace(new RegExp(search, 'g'), replacement);
            };
            //questions
            var choice = "-- Please Select --";

        }


    }

)();