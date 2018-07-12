(function () {
        'use strict';

        angular
            .module('crowdjump.admin.controllers')
            .controller('AdminController', AdminController);

        AdminController.$inject = ['$scope', 'Authentication', 'Questionnaire', 'Ideas', 'Comments', 'History'];

        function AdminController($scope, Authentication, Questionnaire, Ideas, Comments, History) {
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
                get_ideas();
                get_versions();
            }


            $scope.submit = function (next_survey) {

                var content = {};
                var post_check = vm.surveystatus;
                var next_survey_id = next_survey;
                var dontAdvance = false; //test only, always false

                if (vm.surveystatus >= 3) {

                    post_check = vm.surveystatus - 1;
                    next_survey_id += 4;
                }

                var checked = $scope.checkAll(post_check);

                if (vm.surveystatus < 3 && checked) {
                    content = $scope.getContent(post_check);
                    // console.log(content);
                    Questionnaire.post_preSite(vm.cookie["id"], vm.surveystatus, content);

                } else if (vm.surveystatus == 4) {
                    Questionnaire.post_postSite(vm.cookie["id"], 0, '');

                }
                else if (checked) {
                    content = $scope.getContent(post_check);
                    Questionnaire.post_postSite(vm.cookie["id"], post_check - 3, content);

                } else if (vm.surveystatus != 3 && vm.surveystatus != 4 && vm.surveystatus != 11) {
                    alert("Please answer all required questions first!");
                    return;

                }

                if (dontAdvance) return;
                // console.log(next_survey_id);
                vm.surveystatus = next_survey_id;
                Questionnaire.increase_surveycount(vm.cookie["username"], next_survey_id);
                if (vm.surveystatus < 3) {
                    window.location.href = '/survey' + next_survey;
                } else if (vm.surveystatus == 3) {
                    window.location.href = '/surveyPreFinished';

                } else if (vm.surveystatus < 11) {
                    window.location.href = '/postsurvey' + next_survey;

                } else {
                    window.location.href = '/surveyPostFinished';
                }
            }

            //false when error
            $scope.checkAll = function (sur) {
                var error = false;
                for (var i = 0; i < $scope.survey[sur].length; i++) {
                    var q = $scope.survey[sur][i];
                    // console.log(q);
                    if (!q.checked && q.required && q.visible) {
                        // console.log(q.nr);
                        // console.log(q.selected);
                        error = true;
                        q.error = true;
                    } else {
                        q.error = false;
                    }
                    // console.log(q.checked);
                }
                return !error;
            }

            $scope.getContent = function (sur) {
                var content = [];
                for (var i = 0; i < $scope.survey[sur].length; i++) {
                    var q = $scope.survey[sur][i];

                    if (q.type === 'combo') {
                        if (q.value === choice) {
                            content.push('');
                        } else {
                            content.push(q.value);
                        }

                    } else if (q.type === 'check') {
                        var values = '';
                        var other = '';
                        $.each(q.selected, function (index, value) {
                            if (value) {
                                if (index == q.choices.length) {
                                    //other
                                    other = q.value;
                                } else {
                                    values += index + '/';
                                }
                            }
                        });
                        content.push('[' + values + ']');
                        content.push('other');

                    } else if (q.type === 'radiolist') {
                        if (q.selected < 0 || JSON.stringify(q.selected) == '{}') {
                            content.push(null);
                        } else if (q.selected == q.choices.length) {
                            content.push();
                            content.push(q.value);
                        } else {
                            content.push(q.selected);
                            content.push('');
                        }

                    } else if (q.type === 'scale' || q.type === 'doublescale') {
                        //scales not 0..6 but 1..7
                        if (q.choices.length <= 1) {
                            content.push(q.value + 1);
                        } else {
                            var arr = doubleSortArray(q.selected, q.ordering);
                            $.each(arr, function (index, value) {
                                content.push(parseInt(value) + 1);
                            });
                        }

                    } else {
                        content.push(q.value);
                    }

                }
                return content;
            }

            $scope.checkconditions = function (q) {
                // console.log(q.selected);
                // console.log(q.type);
                if (q.type === 'radio') {
                    if (q.value == 0 || q.value == 1) {
                        q.checked = true;
                    } else {
                        q.checked = false;
                    }
                }

                if (q.type === 'check1') {
                    q.checked = q.selected;
                }

                if (q.type === 'check') {
                    // console.log(q.selected);
                    var found = false;
                    $.each(q.selected, function (index, value) {
                        value ? found = true : 0;
                    });
                    q.checked = found;
                }

                if (q.type === 'radiolist') {
                    // console.log(q.value + ' , ' + JSON.stringify(q.selected));
                    if (q.selected >= 0) {
                        q.checked = true;
                    }
                }

                if (q.type === 'scale' || q.type === 'doublescale') {
                    var notChecked = false;
                    for (var i = 0; i < q.choices.length; i++) {
                        if (q.selected[i] >= 0) {
                            //not undefined
                        } else {
                            notChecked = true;
                            break;
                        }
                    }
                    q.checked = !notChecked;
                }

                if (q.type === "combo") {
                    if (q.value === choice) {
                        q.checked = false;
                    } else {
                        q.checked = true;
                    }
                }

                if (q.type === "text" || q.type === "bigtext") {
                    // console.log("text");
                    if (q.value.length < q.minLength) {
                        q.checked = false;
                    } else {
                        q.checked = true;
                    }

                }
                if (q.checked) {
                    q.error = false;
                    for (var i = 0; i < q.activate.length; i++) {
                        var act = q.activate[i];
                        // console.log(act);
                        if (act.v === '' || act.v === q.value) {
                            $scope.$parent.activate(act.s, act.nr, q.survey + ',' + q.nr);
                        } else {
                            $scope.$parent.deactivate(act.s, act.nr, q.survey + ',' + q.nr);
                        }
                    }
                } else {
                    for (var i = 0; i < q.activate.length; i++) {
                        var act = q.activate[i];
                        // console.log(act);
                        $scope.$parent.deactivate(act.s, act.nr, q.survey + ',' + q.nr);
                    }
                }

                return;
            }

            $scope.activate = function (sur, nr, text) {
                $scope.survey[sur][nr]["activatedBy"].add(text);
                // console.log($scope.survey[sur][nr]["activatedBy"]);
                // console.log(sur + ' ' + nr);
                $scope.survey[sur][nr]["visible"] = true;
            }

            $scope.deactivate = function (sur, nr, text) {
                var survey = $scope.survey[sur][nr];
                var activations = survey["activatedBy"];
                // console.log(activations);
                activations.forEach(function (t) {
                    if (t === text) {
                        // console.log("delete");
                        activations.delete(t);
                    }
                });
                survey["visible"] = (survey["startVisible"] || activations.size > 0);
            }

            $scope.createFile = function (text, name, type) {
                var dlcsv = document.getElementById("dlcsv");
                var file = new Blob([text], {type: type});
                dlcsv.href = URL.createObjectURL(file);
                dlcsv.download = name;
            }

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
                }

                function commentsErrorFn(data, status, headers, config) {
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
                        // var vote = $.grep($scope.ideavotes, function (ideavote) {
                        //     return ideavote.idea === idea.id;
                        // })[0];
                        // if (typeof vote !== 'undefined') {
                        //
                        //     idea.uservote = vote.vote;
                        //
                        // } else {
                        //     idea.uservote = 0;
                        // }

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
                    var site4header = 'I believe I had some choice about doing this activity (KIM/IMI 7 point scale),I thought Crowdjump was quite enjoyable (KIM/IMI 7 point scale),I am satisfied with my performance at Crowdjump (KIM/IMI 7 point scale),I was pretty skilled at Crowdjump (KIM/IMI 7 point scale),I felt pressured while doing Crowdjump (KIM/IMI 7 point scale),I think I am pretty good at this activity (KIM/IMI 7 point scale),I had concerns whether I could do the activity well (KIM/IMI 7 point scale),I was able to control the activity myself (KIM/IMI 7 point scale),I thought Crowdjump was a very interesting activity (KIM/IMI 7 point scale),Crowdjump was fun to do (KIM/IMI 7 point scale),I could choose how to proceed in Crowdjump (KIM/IMI 7 point scale),I felt very tense while doing Crowdjump (KIM/IMI 7 point scale)';
                    var site5header = 'I think that I would like to use this system frequently (SUS 5 point scale),I found the system unnecessarily complex (SUS 5 point scale),I thought the system was easy to use (SUS 5 point scale),I think that I would need the support of a technical person to be able to use this system (SUS 5 point scale),I found the various functions in this system were well integrated (SUS 5 point scale),I thought there was too much inconsistency in this system (SUS 5 point scale),I would imagine that most people would learn to use this system very quickly (SUS 5 point scale),I found the system very cumbersome to use (SUS 5 point scale),I felt very confident using the system (SUS 5 point scale),I needed to learn a lot of things before I could get going with this system (SUS 5 point scale)';
                    var site6header = 'I liked the idea of Crowdjump (5 point scale),I liked to submit new ideas (5 point scale),The game developed in a positive direction (5 point scale),The website developed in a positive direction (5 point scale),The process of choosing the ideas developed in a positive direction (5 point scale),After each submission cycle the features were implemented as requested (5 point scale),The implemented features met my wishes for Crowdjump (5 point scale),I formed a community with other players (5 point scale),Other players interfered with the development (5 point scale),The other players and I worked as a team (5 point scale),My opinion was not heard (5 point scale)';


                    for (var i = 0; i < $scope.PostSurvey.length; i++) {
                        content += '\n' + $scope.PostSurvey[i]["id"] + ',' + $scope.PostSurvey[i]["user"]["id"] + ',';

                        delete $scope.PostSurvey[i]["id"];
                        delete $scope.PostSurvey[i]["user"];
                        delete $scope.PostSurvey[i]["site0"];

                        var values = Object.keys($scope.PostSurvey[i]).map(function (key) {
                            return $scope.PostSurvey[i][key];
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
                    console.log(groupBy(['id'], 'length'));

                }

                $scope.csv += header + content;
                setTimeout($scope.createFile($scope.csv, name + '.csv', 'text/csv'));
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

                setTimeout($scope.createFile($scope.csv, username + '.csv', 'text/csv'));

            }

            $scope.get_gamedata_user = function (username, grouped) {
                var header = '';
                var content = '';
                username = 'admin';
                var data = {"username": username, "version": $scope.newestVersion.label};

                $.ajax({
                    url: '/getgamedata/',
                    data: data,
                    success: function (data) {

                        if (grouped) {
                            header = 'page,time,';
                            var orderedByPage = Object.values(groupBy(data, 'page'));

                            for (var i = 0; i < orderedByPage.length; i++) {
                                orderedByPage[i] = (orderedByPage[i][0]["page"] + ',' + sumUp(orderedByPage[i], "time") + ',');
                                content += '\n' + orderedByPage[i];

                            }
                        } else {
                            header = 'timestamp,level,status,time,jumps,movement_inputs,';
                            for (var i = 0; i < data.length; i++) {
                                content += '\n' + data[i].timestamp + ',' + data[i].level + ',' + data[i].status + ',' + data[i].time + ',' + data[i].jumps + ',' + data[i].movement_inputs + ',';
                            }
                            console.log(data);
                        }
                        $scope.csv = header + content;
                    },
                    error: function (data) {
                        console.log("not found?");
                    }
                });

                setTimeout($scope.createFile($scope.csv, username + '.csv', 'text/csv'));

            }

            $scope.get_tracking_all = function () {

                //ajax get all user files
                var data = {"username": user};

                $.ajax({
                    url: '/gettracking/',
                    data: data,
                    success: function (data) {
                    },
                    error: function (data) {
                    }
                });

            }

            $scope.send_mail = function(){
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
            $scope.get_idea_list = function(){
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

            //questions
            var choice = "-- Please Select --";

        }


    }

)();