(function () {
        'use strict';

        angular
            .module('crowdjump.questionnaire.controllers')
            .controller('QuestionnaireController', QuestionnaireController);

        QuestionnaireController.$inject = ['$scope', 'Authentication', 'Questionnaire'];

        function QuestionnaireController($scope, Authentication, Questionnaire) {
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

            function detectmob() {
                if (navigator.userAgent.match(/Android/i)
                    || navigator.userAgent.match(/webOS/i)
                    || navigator.userAgent.match(/iPhone/i)
                    || navigator.userAgent.match(/iPad/i)
                    || navigator.userAgent.match(/iPod/i)
                    || navigator.userAgent.match(/BlackBerry/i)
                    || navigator.userAgent.match(/Windows Phone/i)
                ) {
                    return true;
                } else {
                    return false;
                }
            }

            function detectmob2() {
                if (window.innerWidth <= 800 && window.innerHeight <= 600) {
                    return true;
                } else {
                    return false;
                }
            }

            var ismobile = (detectmob() || detectmob2());

            if (!vm.isAuthenticated && vm.url.includes("survey")) {
                // console.log(vm.url);
                window.location.href = '/';
                return;
            }

            if (!vm.isAuthenticated && vm.surveystatus < 99) {
                console.log("not authenticated for survey");
                return;
            } else {
            }

            if (vm.cookie == undefined) {
                var s_s = getCookie("survey_status");
                if (s_s == undefined || s_s == "" || s_s==99) {
                    setCookie("survey_status", 0);
                    s_s = 0;
                }
                vm.surveystatus = s_s;


            } else {
                vm.surveystatus = vm.cookie["survey_status"];
            }

            var post_surveystatus = vm.surveystatus - 4;


            if ((vm.surveystatus == 99)&& !vm.url.includes("registrationFormPre") && !vm.url.includes("mobile")) {

                if (ismobile) {
                    window.location.href = '/mobile';
                    return;
                }
                window.location.href = '/registrationFormPre';
                return;
            }
            if (vm.surveystatus == 100 && !vm.url.includes("registrationFormQ") && !vm.url.includes("mobile")) {

                if (ismobile) {
                    window.location.href = '/mobile';
                    return;
                }
                window.location.href = '/registrationFormQ';
                return;
            }

            // console.log(vm.surveystatus);
            if (vm.isAuthenticated && vm.surveystatus >= 0 && vm.surveystatus < 3 && !vm.url.includes("survey" + vm.surveystatus) && !vm.url.includes("mobile")) {

                if (ismobile) {
                    window.location.href = '/mobile';
                    return;
                }
                window.location.href = '/survey' + vm.surveystatus;
                return;
            } else if (vm.surveystatus > 3 && vm.surveystatus < 11 && !vm.url.includes("postsurvey" + post_surveystatus) && !vm.url.includes("mobile")) {

                if (ismobile) {
                    window.location.href = '/mobile';
                    return;
                }
                window.location.href = 'postsurvey' + post_surveystatus;
                return;
            } else if ((vm.surveystatus == 3 || vm.surveystatus == 3) && vm.url.includes("survey") && !vm.url.includes("surveyPreFinished") && !vm.url.includes("mobile")) {
                window.location.href = '/';
            }

            if (vm.url.includes("game2")) {
                refreshAccount();
            }

            // else if (vm.surveystatus > 3 && !vm.url.includes("postsurvey" + vm.surveystatus)) {
            //     console.log(vm.surveystatus);
            //     window.location.href = '/survey' + vm.surveystatus;
            // }


            $scope.submit = function (next_survey) {
                if (next_survey == undefined){
                    return;
                }

                var content = {};
                var post_check = vm.surveystatus;
                var next_survey_id = next_survey;
                var dontAdvance = false; //test only, always false

                if (vm.surveystatus >= 3 && vm.surveystatus < 99) {

                    post_check = vm.surveystatus - 1;
                    next_survey_id += 4;
                }

                var checked = $scope.checkAll(post_check);

                if (vm.surveystatus < 3 && checked) {
                    content = $scope.getContent(post_check);
                    // console.log(content);
                    Questionnaire.post_preSite(vm.cookie["id"], vm.surveystatus, content, vm.cookie);
                    // setTimeout(function(){while (survey_send = false){
                    //     var zweiundvierzig = 42;
                    // };
                    // }, 3000);

                } else if (vm.surveystatus == 4 && checked) {
                    Questionnaire.post_postSite(vm.cookie["id"], 0, '', vm.cookie);

                } else if (vm.surveystatus < 99 && checked) {
                    content = $scope.getContent(post_check);
                    Questionnaire.post_postSite(vm.cookie["id"], post_check - 3, content, vm.cookie);

                } else if ((vm.surveystatus == 99 || vm.surveystatus == 100) && checked) {
                    content = $scope.getContent(vm.surveystatus);
                    Questionnaire.post_Form(vm.surveystatus-99, content);

                } else if (vm.surveystatus != 3 && vm.surveystatus != 11) {
                    alert("Please answer all required questions first!");
                    return;

                }

                if (dontAdvance) return;
                // console.log(next_survey_id);
                vm.surveystatus = next_survey_id;
                Questionnaire.increase_surveycount(vm.cookie["username"], next_survey_id);
                // if (vm.surveystatus < 3) {
                //     log("test2");
                //     window.location.href = '/survey' + next_survey;
                // } else if (vm.surveystatus == 3) {
                //     window.location.href = '/surveyPreFinished';
                //
                // } else if (vm.surveystatus < 11) {
                //     window.location.href = '/postsurvey' + next_survey;
                //
                // } else {
                //     window.location.href = '/surveyPostFinished';
                // }
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
                        content.push(other);

                    } else if (q.type === 'radiolist') {
                        if (q.selected < 0 || JSON.stringify(q.selected) == '{}') {
                            content.push(null);
                        } else if (q.selected == q.choices.length) {
                            content.push();
                            content.push(q.value);
                        } else {
                            //change
                            if (!q.visible) {
                                content.push();
                                content.push('');
                            } else {
                                content.push(q.selected);
                                content.push('');
                            }
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

                if (q.type === "text" || q.type === "bigtext" || q.type === "email") {
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

            $scope.setPost = function () {
                Questionnaire.increase_surveycount(vm.cookie["username"], 4);
                window.location.href = '/postsurvey0';

            };

            $scope.getNumber = function (num) {
                return new Array(num);
            }

            function randomize(array, random = true) {
                var currentIndex = array.length, temporaryValue, randomIndex;
                var ordering = [];

                for (var i = 0; i < array.length; i++) {
                    ordering.push(i);
                }
                if (!random) {
                    return [array, ordering];
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

            $scope.selected = [];

            //questions
            var choice = "-- Please Select --";
            var choicede = "Bitte auswählen...";
            var scale5 = ["not at all", "slightly", "moderately", "fairly", "extremely"];
            var scale5de = ["stimmt gar nicht", "stimmt wenig", "stimmt teils-teils", "stimmt ziemlich", "stimmt völlig"]
            var scale7 = ["not at all", , , , , , "very much"];
            var scale7Gamex = ["strongly disagree", , , , , , "strongly agree"];
            var scale7IMI = ["1 not at all true", "2", "3", "4 somewhat true", "5", "6", "7 very true"];
            var scale7de = ["überhaupt nicht", , , , , , "sehr"];
            var scale7AB = ["A", , , , , , "B"];
            var choicesYesNo = ["No", "Yes"];

            $scope.survey = [];

            var english = true;

            if (false) {
                $scope.exChoices = [choice, "< 18", "18 - 26", "26 - 39", "> 40"];
                $scope.exDoubleChoices = [["A: Ich bin sehr schlecht in Videospielen", "B: Ich bin sehr gut in Videospielen"],
                    ["A: Nur das Design eines Produktes is wichtig ", "B: Nur die Funktion eines Produktes ist wichtig"]];
                $scope.exScaleDescription = ["überhaupt nicht", , , , , , "sehr"];
                $scope.exText = {
                    survey: 1,
                    nr: 0,
                    type: 'text',
                    text: 'Text1',
                    required: true,
                    startVisible: true,
                    visible: true,
                    minLength: 1,
                    activate: [{v: '', s: 1, nr: 1}],
                    showImage: false,
                    imageURL: 'http://wallpaperget.com/images/super-mario-world-wallpaper-24.jpg',
                    imageWidth: 1100,
                    value: '',
                    checked: false,
                    error: false,
                    activatedBy: new Set(),
                };
                $scope.exBigtext = {
                    survey: 1,
                    nr: 0,
                    type: 'bigtext',
                    text: 'Text1',
                    required: true,
                    startVisible: true,
                    visible: true,
                    minLength: 1,
                    activate: [{v: '', s: 1, nr: 1}],
                    showImage: false,
                    imageURL: 'http://wallpaperget.com/images/super-mario-world-wallpaper-24.jpg',
                    imageWidth: 1100,
                    value: '',
                    checked: false,
                    error: false,
                    activatedBy: new Set(),
                };
                $scope.exCombo = {
                    survey: 1,
                    nr: 1,
                    type: 'combo',
                    text: 'Alter',
                    required: true,
                    startVisible: true,
                    visible: true,
                    choices: $scope.sur1q3Choices,
                    activate: [{v: '', s: 1, nr: 1}],
                    showImage: false,
                    imageURL: 'http://wallpaperget.com/images/super-mario-world-wallpaper-24.jpg',
                    imageWidth: 1100,
                    value: '',
                    checked: false,
                    error: false,
                    activatedBy: new Set(),
                };
                $scope.exRadio = {
                    survey: 1,
                    nr: 1,
                    type: 'radio',
                    text: 'Alter',
                    required: true,
                    startVisible: true,
                    visible: true,
                    choices: $scope.sur1q3Choices,
                    activate: [{v: 1, s: 1, nr: 1}],
                    showImage: false,
                    imageURL: 'http://wallpaperget.com/images/super-mario-world-wallpaper-24.jpg',
                    imageWidth: 1100,
                    value: '-1',
                    checked: false,
                    error: false,
                    activatedBy: new Set(),
                };
                $scope.exCheck = {
                    survey: 1,
                    nr: 1,
                    type: 'check',
                    text: 'Alter',
                    required: true,
                    startVisible: true,
                    visible: true,
                    choices: $scope.sur1q3Choices,
                    freeChoice: 'Andere',
                    activate: [{v: 1, s: 1, nr: 1}],
                    showImage: false,
                    imageURL: 'http://wallpaperget.com/images/super-mario-world-wallpaper-24.jpg',
                    imageWidth: 1100,
                    value: '',
                    checked: false,
                    error: false,
                    activatedBy: new Set(),
                    selected: {}
                };
                $scope.exRadioList = {
                    survey: 1,
                    nr: 1,
                    type: 'radiolist',
                    text: 'Alter',
                    required: true,
                    startVisible: true,
                    visible: true,
                    choices: $scope.sur1q3Choices,
                    freeChoice: 'Andere',
                    activate: [{v: 1, s: 1, nr: 1}],
                    showImage: false,
                    imageURL: 'http://wallpaperget.com/images/super-mario-world-wallpaper-24.jpg',
                    imageWidth: 1100,
                    value: '',
                    checked: false,
                    error: false,
                    activatedBy: new Set(),
                    selected: {}
                };
                $scope.exScale = {
                    survey: 1,
                    nr: 1,
                    type: 'scale',
                    text: 'Bitte bewerte die folgenden Aussagen über Plattformer (wie Super Mario oder Super Meat Boy) auf einer Skala von "überhaupt nicht" bis "sehr".',
                    required: true,
                    startVisible: true,
                    visible: true,
                    choices: $scope.sur1q3Choices,
                    ordering: $scope.sur1q3Ordering,
                    scale: $scope.sur1q3Scale,
                    nrscales: 7,
                    freeChoice: 'Andere',
                    activate: [{v: 1, s: 1, nr: 1}],
                    showImage: false,
                    imageURL: 'http://wallpaperget.com/images/super-mario-world-wallpaper-24.jpg',
                    imageWidth: 1100,
                    randomized: true,
                    value: '',
                    checked: false,
                    error: false,
                    activatedBy: new Set(),
                    selected: [{}]
                };
                $scope.exDoubleScale = {
                    survey: 1,
                    nr: 1,
                    type: 'doublescale',
                    text: 'Bitte bewerte die folgenden Aussagen über Plattformer (wie Super Mario oder Super Meat Boy) auf einer Skala von "überhaupt nicht" bis "sehr".',
                    required: true,
                    startVisible: true,
                    visible: true,
                    choices: $scope.sur1q3Choices,
                    scale: $scope.sur1q3Scale,
                    nrscales: 7,
                    freeChoice: 'Andere',
                    activate: [{v: 1, s: 1, nr: 1}],
                    showImage: false,
                    randomized: true,
                    imageURL: 'http://wallpaperget.com/images/super-mario-world-wallpaper-24.jpg',
                    imageWidth: 1100,
                    value: '',
                    checked: false,
                    error: false,
                    activatedBy: new Set(),
                    selected: [{}]
                };
            } //Examples

            //RegistrationForm
            $scope.survey[99] = [];
            $scope.survey[100] = [];


            if (true) {
                $scope.sur99q0Choices = [""];
                $scope.survey[99][0] = {
                    survey: 99,
                    nr: 0,
                    type: 'check1',
                    text: '',
                    required: true,
                    startVisible: true,
                    visible: true,
                    choices: $scope.sur99q0Choices,
                    freeChoice: '',
                    activate: [],
                    showImage: false,
                    imageURL: '',
                    imageWidth: 1100,
                    value: '',
                    checked: false,
                    error: false,
                    activatedBy: new Set(),
                    selected: {}
                };

            } //RegistrationFormPre Nur zum Speichern

            if (true) {
                $scope.survey[100][0] = {
                    survey: 100,
                    nr: 0,
                    type: 'email',
                    text: 'Email address',
                    required: true,
                    startVisible: true,
                    visible: true,
                    minLength: 1,
                    activate: [],
                    showImage: false,
                    imageURL: '',
                    imageWidth: 1100,
                    value: '',
                    checked: false,
                    error: false,
                    activatedBy: new Set(),
                };
                $scope.survey[100][1] = {
                    survey: 100,
                    nr: 1,
                    type: 'radio',
                    text: 'Have you participated in a previous iteration of crowdjump?',
                    required: true,
                    startVisible: true,
                    visible: true,
                    choices: choicesYesNo,
                    activate: [],
                    showImage: false,
                    imageURL: '',
                    imageWidth: 1100,
                    value: '-1',
                    checked: false,
                    error: false,
                    activatedBy: new Set(),
                };
                $scope.survey[100][2] = {
                    survey: 100,
                    nr: 2,
                    type: 'radio',
                    text: 'Are you interested in seeing the development of a videogame?',
                    required: true,
                    startVisible: true,
                    visible: true,
                    choices: choicesYesNo,
                    activate: [],
                    showImage: false,
                    imageURL: '',
                    imageWidth: 1100,
                    value: '-1',
                    checked: false,
                    error: false,
                    activatedBy: new Set(),
                };
                $scope.survey[100][3] = {
                    survey: 100,
                    nr: 3,
                    type: 'radio',
                    text: 'Would you like to have influence over the development?',
                    required: true,
                    startVisible: true,
                    visible: true,
                    choices: choicesYesNo,
                    activate: [],
                    showImage: false,
                    imageURL: '',
                    imageWidth: 1100,
                    value: '-1',
                    checked: false,
                    error: false,
                    activatedBy: new Set(),
                };

            } //RegistrationForm

            //Pre Survey
            $scope.survey[0] = [];
            $scope.survey[1] = [];
            $scope.survey[2] = [];

            if (english) {
                if (true) {
                    $scope.sur0q0Choices = [""];
                    $scope.survey[0][0] = {
                        survey: 0,
                        nr: 0,
                        type: 'check1',
                        text: '',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur0q0Choices,
                        freeChoice: '',
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        imageWidth: 1100,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: {}
                    };

                } //Survey0 Nur zum Speichern

                if (true) {
                    $scope.sur1q0Choices = [choice, "< 18", "18 - 26", "26 - 39", "> 40"];
                    $scope.survey[1][0] = {
                        survey: 1,
                        nr: 0,
                        checked: false,
                        type: 'combo',
                        text: 'Age',
                        required: false,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur1q0Choices,
                        activate: [],
                        value: '',
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.sur1q1Choices = [choice, "female", "male", "other"];
                    $scope.survey[1][1] = {
                        survey: 1,
                        nr: 1,
                        checked: false,
                        type: 'combo',
                        text: 'Gender',
                        required: false,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur1q1Choices,
                        activate: [],
                        value: '',
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.survey[1][18] = {
                        survey: 1,
                        nr: 18,
                        type: 'bigtext',
                        text: 'Job',
                        required: true,
                        startVisible: true,
                        visible: true,
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.sur1q2Choices = [choice, "0 - 5", "5 - 10", "10 - 15", "15 - 20", "20-25", "25+"];
                    $scope.survey[1][2] = {
                        survey: 1,
                        nr: 2,
                        checked: false,
                        type: 'combo',
                        text: 'Time in hours you use your PC per week',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur1q2Choices,
                        activate: [],
                        value: '',
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.survey[1][3] = {
                        survey: 1,
                        nr: 3,
                        type: 'combo',
                        text: 'Time in hours you play video games per week',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur1q2Choices,
                        activate: [],
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.sur1q4Choices = ["Story", "Graphic", "Innovation", "Multiplayer", "Competition with other players", "Difficulty", "Gameplay"];
                    $scope.survey[1][4] = {
                        survey: 1,
                        nr: 4,
                        type: 'check',
                        text: 'What are important aspects in a video game?',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur1q4Choices,
                        freeChoice: 'Other',
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        imageWidth: 1100,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: {}
                    };
                    $scope.survey[1][5] = {
                        survey: 1,
                        nr: 5,
                        type: 'radiolist',
                        text: 'What is THE most important aspect in a video game?',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur1q4Choices,
                        freeChoice: 'Other',
                        activate: [{v: 1, s: 1, nr: 1}],
                        showImage: false,
                        imageURL: '',
                        imageWidth: 1100,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: {}
                    };
                    $scope.sur1q6ChoicesOG = randomize(["I played a lot of platformers", "I like platformers", "I like platformers more than other game genres"]);
                    $scope.sur1q6Choices = $scope.sur1q6ChoicesOG[0];
                    $scope.sur1q6Ordering = $scope.sur1q6ChoicesOG[1];
                    $scope.survey[1][6] = {
                        survey: 1,
                        nr: 6,
                        type: 'scale',
                        text: 'Please rate the following statements about platform games (like Super Mario or Super Meat Boy) from "not at all" to "very much".',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur1q6Choices,
                        ordering: $scope.sur1q6Ordering,
                        scale: scale7,
                        nrscales: 7,
                        freeChoice: '',
                        randomized: true,
                        activate: [],
                        showImage: true,
                        imageURL: 'http://wallpaperget.com/images/super-mario-world-wallpaper-24.jpg',
                        imageWidth: 1100,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };
                    $scope.survey[1][7] = {
                        survey: 1,
                        nr: 7,
                        type: 'radio',
                        text: 'Have you ever designed a video game?',
                        required: true,
                        startVisible: true,
                        visible: true,
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        value: '-1',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.survey[1][8] = {
                        survey: 1,
                        nr: 8,
                        type: 'radio',
                        text: 'Have you ever designed an application? (except video games)',
                        required: true,
                        startVisible: true,
                        visible: true,
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.survey[1][9] = {
                        survey: 1,
                        nr: 9,
                        type: 'radio',
                        text: 'If you had the choice, do you want to be included in the design process of a video game?',
                        required: true,
                        startVisible: true,
                        visible: true,
                        activate: [{v: 1, s: 1, nr: 10}],
                        showImage: false,
                        imageURL: '',
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.survey[1][10] = {
                        survey: 1,
                        nr: 10,
                        type: 'bigtext',
                        text: 'How would you like to be included?',
                        required: false,
                        startVisible: false,
                        visible: false,
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.survey[1][11] = {
                        survey: 1,
                        nr: 11,
                        type: 'radio',
                        text: 'Have you ever watched a "Twitch Plays" series (e.g. Twitch Plays Pokemon, Twitch Plays Darksouls, Twitch Plays Pubg, etc) on Twitch?',
                        required: true,
                        startVisible: true,
                        visible: true,
                        activate: [{v: 1, s: 1, nr: 12}, {v: 1, s: 1, nr: 13}],
                        showImage: false,
                        imageURL: '',
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.survey[1][12] = {
                        survey: 1,
                        nr: 12,
                        type: 'radio',
                        text: 'Did you actively participate in the Twitch Plays series?',
                        required: true,
                        startVisible: false,
                        visible: false,
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.sur1q13Choices = ["How did you like Twitch Plays?"];
                    $scope.survey[1][13] = {
                        survey: 1,
                        nr: 13,
                        type: 'scale',
                        text: '',
                        required: true,
                        startVisible: false,
                        visible: false,
                        choices: $scope.sur1q13Choices,
                        scale: scale7,
                        nrscales: 7,
                        freeChoice: '',
                        imageURL: '',
                        activate: [],
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };
                    $scope.survey[1][14] = {
                        survey: 1,
                        nr: 14,
                        type: 'radio',
                        text: 'Have you heard of "PleaseBeNice"?',
                        required: true,
                        startVisible: true,
                        visible: true,
                        activate: [{v: 1, s: 1, nr: 15}, {v: 1, s: 1, nr: 16}, {v: 1, s: 1, nr: 17}],
                        showImage: false,
                        imageURL: '',
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.survey[1][15] = {
                        survey: 1,
                        nr: 15,
                        type: 'radio',
                        text: 'Did you play "PleaseBeNice" yourself?',
                        required: true,
                        startVisible: false,
                        visible: false,
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.sur1q16Choices = ['How did you like "PleaseBeNice"?'];
                    $scope.survey[1][16] = {
                        survey: 1,
                        nr: 16,
                        type: 'scale',
                        text: '',
                        required: true,
                        startVisible: false,
                        visible: false,
                        choices: $scope.sur1q16Choices,
                        scale: scale7,
                        nrscales: 7,
                        freeChoice: '',
                        activate: [],
                        value: '',
                        showImage: false,
                        imageURL: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };
                    $scope.survey[1][17] = {
                        survey: 1,
                        nr: 17,
                        type: 'radio',
                        text: 'Did one of your ideas get implemented?',
                        required: true,
                        startVisible: false,
                        visible: false,
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    // $scope.survey[1][19] = {
                    //     survey: 1,
                    //     nr: 19,
                    //     type: 'radio',
                    //     text: 'Have you heard of "Crowdjump" before?',
                    //     required: true,
                    //     startVisible: true,
                    //     visible: true,
                    //     activate: [{v: 1, s: 1, nr: 20}, {v: 1, s: 1, nr: 21}, {v: 1, s: 1, nr: 22}],
                    //     showImage: false,
                    //     imageURL: '',
                    //     value: '',
                    //     checked: false,
                    //     error: false,
                    //     activatedBy: new Set(),
                    // };
                    // $scope.survey[1][20] = {
                    //     survey: 1,
                    //     nr: 20,
                    //     type: 'radio',
                    //     text: 'Did you play "Crowdjump" yourself?',
                    //     required: true,
                    //     startVisible: false,
                    //     visible: false,
                    //     activate: [],
                    //     showImage: false,
                    //     imageURL: '',
                    //     value: '',
                    //     checked: false,
                    //     error: false,
                    //     activatedBy: new Set(),
                    // };
                    // $scope.sur1q17Choices = ['How did you like "Crowdjump"?'];
                    // $scope.survey[1][21] = {
                    //     survey: 1,
                    //     nr: 21,
                    //     type: 'scale',
                    //     text: '',
                    //     required: true,
                    //     startVisible: false,
                    //     visible: false,
                    //     choices: $scope.sur1q17Choices,
                    //     scale: scale7,
                    //     nrscales: 7,
                    //     freeChoice: '',
                    //     activate: [],
                    //     value: '',
                    //     showImage: false,
                    //     imageURL: '',
                    //     checked: false,
                    //     error: false,
                    //     activatedBy: new Set(),
                    //     selected: [{}]
                    // };
                    // $scope.survey[1][22] = {
                    //     survey: 1,
                    //     nr: 22,
                    //     type: 'radio',
                    //     text: 'Did one of your "Crowdjump" ideas get implemented?',
                    //     required: true,
                    //     startVisible: false,
                    //     visible: false,
                    //     activate: [],
                    //     showImage: false,
                    //     imageURL: '',
                    //     value: '',
                    //     checked: false,
                    //     error: false,
                    //     activatedBy: new Set(),
                    // };
                } //Survey1

                if (true) {
                    $scope.sur2q0ChoicesOG = randomize([["A: I am really bad at video games", "B: I am extremely good in video games"],
                        ["A: Only the design of a product is important", "B: Only functionality of a product is important"],
                        ["A: I prefer to work alone", "B: I prefer to work with others"],
                        ["A: Everyone's opinion should be heard equally", "B: The opinion of experts have a higher value"],
                        ["A: I prefer very easy games", "B: I prefer very hard games"],
                        ["A: I like to have a lot of freedom", "B: I prefer someone giving me tasks"],
                        ["A: I prefer it when things don't change", "B: I prefer regular innovation"],
                        ["A: I hate to compete with others", "B: I thrive on competition"],
                        ["A: I see myself as a follower", "B: I see myself as a leader"],
                        ["A: I love to discuss with others", "B: I prefer to not communicate with others at all"]]);
                    $scope.sur2q0Choices = $scope.sur2q0ChoicesOG[0];
                    $scope.sur2q0Ordering = $scope.sur2q0ChoicesOG[1];

                    $scope.survey[2][0] = {
                        survey: 2,
                        nr: 0,
                        type: 'doublescale',
                        text: 'Please choose whether you lean more towards A or B:',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur2q0Choices,
                        ordering: $scope.sur2q0Ordering,
                        scale: scale7AB,
                        nrscales: 7,
                        freeChoice: '',
                        activate: [],
                        randomized: true,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };

                } //Survey2
            }


            //Post Survey +3
            $scope.survey[3] = [];
            $scope.survey[4] = [];
            $scope.survey[5] = [];
            $scope.survey[6] = [];
            $scope.survey[7] = [];
            $scope.survey[8] = [];
            $scope.survey[9] = [];

            if (english) {
                if (true) {
                    $scope.sur3q0Choices = [""];
                    $scope.survey[3][0] = {
                        survey: 3,
                        nr: 0,
                        type: 'check1',
                        text: '',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur3q0Choices,
                        freeChoice: '',
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        imageWidth: 1100,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: {}
                    };

                } //PostSurvey0 Nur zum Speichern

                if (false) {
                    $scope.sur5q0ChoicesOG = randomize(["I felt challenged",
                        "I felt pressured",
                        "I felt frustrated",
                        "I was fully occupied with the game",
                        "I had to put a lot of effort into it",
                        "It was asthetically pleasing",
                        "I felt annoyed",
                        "I found it impressive",
                        "It felt like a rich experience",
                        "I was deeply concentrated in the game",
                        "I thought it was fun",
                        "I felt succesful",
                        "I felt irritable",
                        "I was fast at reaching the game's targets",
                        "I felt that I could explore things",
                        "I felt skillful",
                        "I found it tiresome",
                        "I felt competent",
                        "I forgot everything around me",
                        "I felt bored",
                        "I felt content",
                        "I lost connection with the outside world",
                        "I thought about other things",
                        "I felt good",
                        "I felt imaginative",
                        "I felt time pressure",
                        "It gave me a bad mood",
                        "I felt happy",
                        "I was good at it",
                        "I lost track of time",
                        "I was interested in the game's story",
                        "I thought it was hard",
                        "I enjoyed it"]);
                    $scope.sur5q0Choices = $scope.sur5q0ChoicesOG[0];
                    $scope.sur5q0Ordering = $scope.sur5q0ChoicesOG[1];
                    $scope.survey[5][0] = {
                        survey: 5,
                        nr: 0,
                        type: 'scale',
                        text: 'Please indicate how you felt while playing the game for each of the items on the following scale. ',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur5q0Choices,
                        ordering: $scope.sur5q0Ordering,
                        scale: scale5,
                        nrscales: 5,
                        freeChoice: '',
                        activate: [],
                        value: '',
                        showImage: false,
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };

                } //PostSurvey2 GEQ

                if (false) {
                    $scope.sur6q0ChoicesOG = randomize(["I found it enjoyable to be with the other(s)",
                        "I felt schadenfreude (malicious delight)",
                        "I envied the other(s)",
                        "I felt jealous of the other(s)",
                        "I paid close attention to the other(s)",
                        "The other(s) tended to ignore me",
                        "My intentions were clear to the other(s)",
                        "I felt revengeful",
                        "What I did affected what the other(s) did",
                        "The other(s) paid close attention to me",
                        "I felt connected to the other(s)",
                        "I admired the other(s)",
                        "My actions depended on the other’s actions",
                        "I tended to ignore the other(s)",
                        "What the other(s) did affected what I did",
                        "I empathized with the other(s)",
                        "I sympathized with the other(s)",
                        "When I was happy, the others were happy",
                        "The other's actions were dependent on my actions",
                        "When the others were happy, I was happy",
                        "The other’s intentions were clear to me"]);
                    $scope.sur6q0Choices = $scope.sur6q0ChoicesOG[0];
                    $scope.sur6q0Ordering = $scope.sur6q0ChoicesOG[1];
                    $scope.survey[6][0] = {
                        survey: 6,
                        nr: 0,
                        type: 'scale',
                        text: 'Please rate the following statements on a scale from "not at all" to "extremely". ',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur6q0Choices,
                        ordering: $scope.sur6q0Ordering,
                        scale: scale5,
                        nrscales: 5,
                        freeChoice: '',
                        activate: [],
                        value: '',
                        showImage: false,
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };

                } //PostSurvey3 SPGQ

                if (true) {
                    $scope.sur6q0ChoicesOG = randomize(["Playing the game was fun.",
                        "I liked playing the game.",
                        "I enjoyed playing the game very much.",
                        "My game experience was pleasurable.",
                        "I think playing the game is very entertaining.",
                        "I would play this game for its own sake, not only when being asked to.",
                        "Playing the game made me forget where I am.",
                        "I forgot about my immediate surroundings while I played the game.",
                        "After playing the game, I felt like coming back to the \"real world \" after a journey.",
                        "Playing the game \" got me away from it all \".",
                        "While playing the game I was completely oblivious to everything around me.",
                        "While playing the game I lost track of time.",
                        "Playing the game sparked my imagination.",
                        "While playing the game I felt creative.",
                        "While playing the game I felt that I could explore things.",
                        "While playing the game I felt adventurous.",
                        "While playing the game I felt activated.",
                        "While playing the game I felt jittery.",
                        "While playing the game I felt frenzied.",
                        "While playing the game I felt excited.",
                        "While playing the game I felt upset.",
                        "While playing the game I felt hostile.",
                        "While playing the game I felt frustrated.",
                        "While playing the game I had the feeling of being in charge.",
                        "While playing the game I felt influential.",
                        "While playing the game I felt autonomous.",
                        "While playing the game I felt confident."]);
                    $scope.sur6q0Choices = $scope.sur6q0ChoicesOG[0];
                    $scope.sur6q0Ordering = $scope.sur6q0ChoicesOG[1];
                    $scope.survey[6][0] = {
                        survey: 6,
                        nr: 0,
                        type: 'scale',
                        text: 'Please rate the following statements on a scale from "strongly disagree" to "strongly agree". ',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur6q0Choices,
                        ordering: $scope.sur6q0Ordering,
                        scale: scale7Gamex,
                        nrscales: 7,
                        freeChoice: '',
                        activate: [],
                        value: '',
                        image_url: '',
                        showImage: false,
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };

                } //PostSurvey new 2/3 GAMEX

                if (false) {
                    $scope.sur7q0ChoicesOG = randomize(["I believe I had some choice about doing this activity.",
                        "I thought Crowdjump was quite enjoyable.",
                        "I am satisfied with my performance at Crowdjump.",
                        "I was pretty skilled at Crowdjump.",
                        "I felt pressured while doing Crowdjump.",
                        "I think I am pretty good at this activity.",
                        "I had concerns whether I could do the activity well.",
                        "I was able to control the activity myself.",
                        "I thought Crowdjump was a very interesting activity.",
                        "Crowdjump was fun to do.",
                        "I could choose how to proceed in Crowdjump.",
                        "I felt very tense while doing Crowdjump."]);
                    $scope.sur7q0Choices = $scope.sur7q0ChoicesOG[0];
                    $scope.sur7q0Ordering = $scope.sur7q0ChoicesOG[1];

                    // $scope.sur7q0Scale = ["not at all true", , , "somewhat true", , , "very true"]
                    $scope.survey[7][0] = {
                        survey: 7,
                        nr: 0,
                        type: 'scale',
                        text: 'The following items concern your experience with the task. Please answer all items and indicate how true the statement is for you, using a scale from "not at all" to "extremely". ',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur7q0Choices,
                        ordering: $scope.sur7q0Ordering,
                        scale: scale5,
                        nrscales: 5,
                        freeChoice: '',
                        activate: [],
                        value: '',
                        showImage: false,
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };

                } //ALT!!!! PostSurvey4 KIM / IMI

                if (true) {
                    $scope.sur7q0ChoicesOG = randomize(["I enjoyed playing Crowdjump very much.",
                        "Playing Crowdjump was fun to do.",
                        "I thought Crowdjump was a boring activity.",
                        "Crowdjump did not hold my attention at all.",
                        "I would describe Crowdjump as very interesting.",
                        "I thought Crowdjump was quite enjoyable.",
                        "While I was playing Crowdjump, I was thinking about how much I enjoyed it.",
                        "I think I am pretty good at playing Crowdjump.",
                        "I think I did pretty well at playing Crowdjump, compared to other players.",
                        "After working with Crowdjump for a while, I felt pretty competent.",
                        "I am satisfied with my performance at Crowdjump.",
                        "I was pretty skilled at playing Crowdjump.",
                        "Playing Crowdjump was an activity that I couldn't do very well.",
                        "I did not feel nervous at all while playing Crowdjump.",
                        "I felt very tense while playing Crowdjump.",
                        "I was very relaxed while playing Crowdjump.",
                        "I was anxious while playing Crowdjump.",
                        "I felt pressured while playing Crowdjump.",
                        "I believe I had some choice about playing Crowdjump.",
                        "I felt like it was not my own choice to play Crowdjump.",
                        "I didn't really have a choice about playing Crowdjump.",
                        "I felt like I had to play Crowdjump.",
                        "I did play Crowdjump because I had no choice.",
                        "I did play Crowdjump because I wanted to.",
                        "I did play Crowdjump because I had to.",
                        "I felt really distant to the other players.",
                        "I really doubt that other players and I would ever be friends.",
                        "I felt like I could really trust the other players.",
                        "I'd like to have a chance to interact with the other players more often.",
                        "I'd really prefer not to interact with the other players in the future.",
                        "I don't feel like I could really trust the other players.",
                        "It is likely that the other players and I could become friends if we interacted a lot.",
                        "I feel close to the other players."
                    ]);
                    $scope.sur7q0Choices = $scope.sur7q0ChoicesOG[0];
                    $scope.sur7q0Ordering = $scope.sur7q0ChoicesOG[1];

                    // $scope.sur7q0Scale = ["not at all true", , , "somewhat true", , , "very true"]
                    $scope.survey[7][0] = {
                        survey: 7,
                        nr: 0,
                        type: 'scale',
                        text: 'For each of the following statements, please indicate how true it is for you, using the following scale: ',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur7q0Choices,
                        ordering: $scope.sur7q0Ordering,
                        scale: scale7IMI,
                        nrscales: 7,
                        freeChoice: '',
                        activate: [],
                        value: '',
                        showImage: false,
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };

                } //PostSurvey4 IMI NEW

                if (true) {
                    $scope.sur8q0Scale = ["Strongly disagree", "", "", "", "Strongly agree"]
                    $scope.sur8q0ChoicesOG = randomize(["I think that I would like to use this system frequently.",
                        "I found the system unnecessarily complex.",
                        "I thought the system was easy to use.",
                        "I think that I would need the support of a technical person to be able to use this system.",
                        "I found the various functions in this system were well integrated.",
                        "I thought there was too much inconsistency in this system.",
                        "I would imagine that most people would learn to use this system very quickly.",
                        "I found the system very cumbersome to use.",
                        "I felt very confident using the system.",
                        "I needed to learn a lot of things before I could get going with this system."
                    ], false);
                    $scope.sur8q0Choices = $scope.sur8q0ChoicesOG[0];
                    $scope.sur8q0Ordering = $scope.sur8q0ChoicesOG[1];
                    $scope.survey[8][0] = {
                        survey: 8,
                        nr: 0,
                        type: 'scale',
                        text: 'Please rate the following statements regarding your experience with Crowdjump on a scale from "strongly disagree" to "strongly agree". ',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur8q0Choices,
                        ordering: $scope.sur8q0Ordering,
                        scale: $scope.sur8q0Scale,
                        nrscales: 5,
                        freeChoice: '',
                        activate: [],
                        value: '',
                        showImage: false,
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };

                } //PostSurvey5 SUS

                if (true) {
                    /*                    $scope.sur9q0ChoicesOG = randomize(["I liked the idea of Crowdjump.",
                                            "I liked to submit new ideas.",
                                            "The game developed in a positive direction.",
                                            "The website developed in a positive direction.",
                                            "The process of choosing the ideas developed in a positive direction.",
                                            "After each submission cycle the features were implemented as requested.",
                                            "The implemented features met my wishes for Crowdjump.",
                                            "I formed a community with other players.",
                                            "Other players interfered with the development.",
                                            "The other players and I worked as a team.",
                                            "My opinion was not heard.",
                                            "There were too many bugs.",
                                            "The performance of the game was good.",
                                            "Too many ideas were implemented each cycle.",
                                            "More ideas should be implemented each cycle.",
                                            "The amount of ideas to choose from was overwhelming.",
                                            "I prefered new ideas over old ones."
                                        ]);*/
                    $scope.sur9q0ChoicesOG = randomize(["I liked the idea of Crowdjump.",
                        "The game developed in a positive direction.",
                        "The website developed in a positive direction.",
                        "The implemented features met my wishes for Crowdjump.",
                        "I formed a community with other players.",
                        "There were too many bugs.",
                        "The performance of the game was good.",
                        "Too many features were implemented each day.",
                        "I would like to submit my own features for the game.",
                        "I would like to submit my own features for the website.",
                        "Players should decide, which features are implemented next.",
                        "I wished for some features to be implemented which were missing.",
                        "I liked the implemented features.",
                        "More features should be implemented each day.",
                        "Assuming that all players could provide feature suggestions, which kind of mechanism could you imagine for developers to know which of the suggestions should be implemented next?",
                    ]);
                    $scope.sur9q0Choices = $scope.sur9q0ChoicesOG[0];
                    $scope.sur9q0Ordering = $scope.sur9q0ChoicesOG[1];
                    $scope.survey[9][0] = {
                        survey: 9,
                        nr: 0,
                        type: 'scale',
                            text: 'Please rate the following statements regarding your experience with Crowdjump on a scale from "not at all" to "extremely". ',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur9q0Choices,
                        ordering: $scope.sur9q0Ordering,
                        scale: scale5,
                        nrscales: 5,
                        freeChoice: '',
                        activate: [],
                        value: '',
                        showImage: false,
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };
                    $scope.survey[9][1] = {
                        survey: 9,
                        nr: 1,
                        type: 'radio',
                        text: 'Have you participated in an other crowdjump study before this one?',
                        required: true,
                        startVisible: true,
                        visible: true,
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };

                } //PostSurvey6
            }

            //Deutsch

            if (!english) {
                if (false) {
                    $scope.sur1q0Choices = [choice, "< 18", "18 - 26", "26 - 39", "> 40"];
                    $scope.survey[1][0] = {
                        survey: 1,
                        nr: 0,
                        checked: false,
                        type: 'combo',
                        text: 'Alter',
                        required: false,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur1q0Choices,
                        activate: [],
                        value: '',
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.sur1q1Choices = [choice, "weiblich", "männlich", "sonstiges"];
                    $scope.survey[1][1] = {
                        survey: 1,
                        nr: 1,
                        checked: false,
                        type: 'combo',
                        text: 'Geschlecht',
                        required: false,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur1q1Choices,
                        activate: [],
                        value: '',
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.sur1q2Choices = [choice, "0 - 5", "5 - 10", "10 - 15", "15 - 20", "25+"];
                    $scope.survey[1][2] = {
                        survey: 1,
                        nr: 2,
                        checked: false,
                        type: 'combo',
                        text: 'Stunden pro Woche, die du am PC verbringst ',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur1q2Choices,
                        activate: [],
                        value: '',
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.survey[1][3] = {
                        survey: 1,
                        nr: 3,
                        type: 'combo',
                        text: 'Stunden pro Woche, die du mit Videospielen verbringst ',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur1q2Choices,
                        activate: [],
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.sur1q4Choices = ["Story", "Grafik", "Innovation", "Mehrspieler-Modus", "Wettbewerb mit anderen Spielern", "Schwierigkeit", "Gameplay/Spielablauf"];
                    $scope.survey[1][4] = {
                        survey: 1,
                        nr: 4,
                        type: 'check',
                        text: 'Was sind deiner Meninung nach die wichtigsten Aspekte in einem Videospiel?',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur1q4Choices,
                        freeChoice: 'Andere',
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        imageWidth: 1100,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: {}
                    };
                    $scope.survey[1][5] = {
                        survey: 1,
                        nr: 5,
                        type: 'radiolist',
                        text: 'Was ist deiner Meinung nach DER wichtigste Aspekt in einem Videospiel?',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur1q4Choices,
                        freeChoice: 'Andere',
                        activate: [{v: 1, s: 1, nr: 1}],
                        showImage: false,
                        imageURL: '',
                        imageWidth: 1100,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: {}
                    };
                    $scope.sur1q6Choices = ["Ich hab viele Plattformer gespielt", "Ich mag Plattformer", "Ich mag Plattformer mehr als andere Videospiel Genre"];
                    $scope.survey[1][6] = {
                        survey: 1,
                        nr: 6,
                        type: 'scale',
                        text: 'Bitte bewerte die folgenden Aussagen über Plattformer (wie Super Mario oder Super Meat Boy) auf einer Skala von "überhaupt nicht" bis "sehr".',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur1q6Choices,
                        scale: scale7,
                        nrscales: 7,
                        freeChoice: '',
                        activate: [],
                        showImage: true,
                        imageURL: 'http://wallpaperget.com/images/super-mario-world-wallpaper-24.jpg',
                        imageWidth: 1100,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };
                    $scope.survey[1][7] = {
                        survey: 1,
                        nr: 7,
                        type: 'radio',
                        text: 'Hast du je ein Spiel designed?',
                        required: true,
                        startVisible: true,
                        visible: true,
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        value: '-1',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.survey[1][8] = {
                        survey: 1,
                        nr: 8,
                        type: 'radio',
                        text: 'Hast du je eine Applikation designed? (außer Videospielen)',
                        required: true,
                        startVisible: true,
                        visible: true,
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        value: '-1',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.survey[1][9] = {
                        survey: 1,
                        nr: 9,
                        type: 'radio',
                        text: 'Wenn du die Wahl hast, würdest du gerne beim Designprozess eines Videospieles beteiligt sein?',
                        required: true,
                        startVisible: true,
                        visible: true,
                        activate: [{v: 1, s: 1, nr: 10}],
                        showImage: false,
                        imageURL: '',
                        value: '-1',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.survey[1][10] = {
                        survey: 1,
                        nr: 10,
                        type: 'bigtext',
                        text: 'Wie wärst du dabei gerne beteiligt?',
                        required: false,
                        startVisible: false,
                        visible: false,
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.survey[1][11] = {
                        survey: 1,
                        nr: 11,
                        type: 'radio',
                        text: 'Hast du je eine "Twitch Plays" (bspw. Twitch Plays Pokemon, Twitch Plays Darksouls, Twitch Plays Pubg, etc) Serie auf Twitch gesehen?',
                        required: true,
                        startVisible: true,
                        visible: true,
                        activate: [{v: 1, s: 1, nr: 12}, {v: 1, s: 1, nr: 13}],
                        showImage: false,
                        imageURL: '',
                        value: '-1',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.survey[1][12] = {
                        survey: 1,
                        nr: 12,
                        type: 'radio',
                        text: 'Hast du aktiv an der "Twitch Plays" Serie teilgenommen? ',
                        required: true,
                        startVisible: false,
                        visible: false,
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        value: '-1',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.sur1q13Choices = ["Wie hat dir Twitch Plays gefallen?"];
                    $scope.survey[1][13] = {
                        survey: 1,
                        nr: 13,
                        type: 'scale',
                        text: '',
                        required: true,
                        startVisible: false,
                        visible: false,
                        choices: $scope.sur1q13Choices,
                        scale: scale7,
                        nrscales: 7,
                        freeChoice: '',
                        imageURL: '',
                        activate: [],
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };
                    $scope.survey[1][14] = {
                        survey: 1,
                        nr: 14,
                        type: 'radio',
                        text: 'Hast du je von PleaseBeNice gehört?',
                        required: true,
                        startVisible: true,
                        visible: true,
                        activate: [{v: 1, s: 1, nr: 15}, {v: 1, s: 1, nr: 16}, {v: 1, s: 1, nr: 17}],
                        showImage: false,
                        imageURL: '',
                        value: '-1',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.survey[1][15] = {
                        survey: 1,
                        nr: 15,
                        type: 'radio',
                        text: 'Hast du PleaseBeNice selbst gespielt?',
                        required: true,
                        startVisible: false,
                        visible: false,
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        value: '-1',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                    $scope.sur1q16Choices = ["Wie hat dir PleaseBeNice gefallen?"];
                    $scope.survey[1][16] = {
                        survey: 1,
                        nr: 16,
                        type: 'scale',
                        text: '',
                        required: true,
                        startVisible: false,
                        visible: false,
                        choices: $scope.sur1q16Choices,
                        scale: scale7,
                        nrscales: 7,
                        freeChoice: '',
                        activate: [],
                        value: '',
                        showImage: false,
                        imageURL: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };
                    $scope.survey[1][17] = {
                        survey: 1,
                        nr: 17,
                        type: 'radio',
                        text: 'Wurde eine deiner Ideen bei PleaseBeNice übernommen?',
                        required: true,
                        startVisible: false,
                        visible: false,
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        value: '-1',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                    };
                } //Survey1 deutsch
                if (false) {
                    $scope.sur2q0Choices = [["A: Ich bin sehr schlecht in Videospielen", "B: Ich bin sehr gut in Videospielen"],
                        ["A: Nur das Design eines Produktes is wichtig", "B: Nur die Funktion eines Produktes ist wichtig"],
                        ["A: Ich bevorzuge es, alleine zu arbeiten", "B: Ich bevorzuge es, mit anderen zu arbeiten"],
                        ["A: Jede Meinung ist gleichermaßen wichtig", "B: Die Meinung von Experten hat einen höheren Stellenwert"],
                        ["A: Ich bevorzuge leichte Spiele", "B: Ich bevorzuge schwere Spiele"],
                        ["A: Ich habe gerne viel Freiheit bei dem was ich tue", "B: Ich bevorzuge jemanden, der mir Aufgaben gibt"],
                        ["A: Mir sind Dinge, die sich nicht verändern am liebsten", "B: Regelmäßige Innovation ist wichtig für mich"],
                        ["A: Ich hasse den Wettbewerb mit anderen", "B: Ich blühe in Wettbewerbssituationen auf"],
                        ["A: Ich sehe mich als Mitläufer", "B: Ich sehe mich als Anführer"],
                        ["A: Ich liebe die Diskussion mit anderen", "B: Mir ist es am liebsten, überhaupt nicht mit anderen Leuten kommunizieren"]];

                    $scope.survey[2][0] = {
                        survey: 2,
                        nr: 0,
                        type: 'doublescale',
                        text: 'Bitte wähle auf der Skala aus, inwiefern du eher A oder B zustimmst',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur2q0Choices,
                        scale: scale7AB,
                        nrscales: 7,
                        freeChoice: '',
                        activate: [],
                        randomized: true,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };

                } //Survey2 deutsch
                if (false) {
                    $scope.sur3q0Scale = ["A1", "A2", "B1", "B2", "C1", "C2"];
                    $scope.sur3q0Choices = ["Reading"];
                    $scope.survey[3][0] = {
                        survey: 3,
                        nr: 0,
                        type: 'scale',
                        text: 'Manche der nachfolgenden Fragen in der Umfrage sind auf englisch. Um deine Antworten auf diese Fragen besser einschätzen zu können, beantworte bitte die nachfolgenden Fragen.\n' +
                            '\n' +
                            'Zuerst, wähle unten den Text, welcher deiner Meinung nach deine Lesefähigkeiten in Englisch am Besten beschreibt.\n' +
                            '\n' +
                            '\n' +
                            '\n' +
                            'A1: I can understand familiar names, words and very simple sentences, for example on notices and posters or in catalogues.\n' +
                            '\n' +
                            'A2: I can read very short, simple texts. I can find specific, predictable information in simple everyday material such as advertisements, prospectuses, menus and timetables and I can understand short simple personal letters.\n' +
                            '\n' +
                            'B1: I can understand texts that consist mainly of high frequency everyday or job-related language. I can understand the description of events, feelings and wishes in personal letters.\n' +
                            '\n' +
                            'B2: I can read articles and reports concerned with contemporary problems in which the writers adopt particular attitudes or viewpoints. I can understand contemporary literary prose\n' +
                            '\n' +
                            'C1: I can understand long and complex factual and literary texts, appreciating distinctions of style. I can understand specialised articles and longer technical instructions, even when they do not relate to my field.\n' +
                            '\n' +
                            'C2: I can read with ease virtually all forms of the written language, including abstract, structurally or linguistically complex texts such as manuals, specialised articles and literary works. ',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur3q0Choices,
                        scale: $scope.sur3q0Scale,
                        nrscales: 6,
                        freeChoice: '',
                        activate: [],
                        value: '',
                        showImage: false,
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };
                    $scope.sur3q1Choices = ["go", "going", "was", "went"];
                    $scope.sur3q2Choices = ["situated", "age", "like", "located"];
                    $scope.sur3q3Choices = ["have not to be", "am not being", "will not be", "can't be"];
                    $scope.sur3q4Choices = ["high", "wide", "long", "heavy"];
                    $scope.sur3q5Choices = ["a", "some", "me", "I"];
                    $scope.sur3q6Choices = ["had", "has had", "has", "had had"];
                    $scope.sur3q7Choices = ["anyone", "some people", "not anybody", "someone"];
                    $scope.sur3q8Choices = ["had know", "knew", "has known", "knows"];
                    $scope.sur3q9Choices = ["can", "will", "may", "might"];
                    $scope.sur3q10Choices = ["just buy", "had just bought", "'ve just", "soon will"];
                    $scope.survey[3][1] = {
                        survey: 3,
                        nr: 1,
                        type: 'radiolist',
                        text: 'Answer the following 10 questions\n' +
                            '\n' +
                            '1) Did you ……… anywhere interesting last weekend? ',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur3q1Choices,
                        freeChoice: '',
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        imageWidth: 1100,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: {}
                    };
                    $scope.survey[3][2] = {
                        survey: 3,
                        nr: 2,
                        type: 'radiolist',
                        text: "2) What is your home town ……… ?",
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur3q2Choices,
                        freeChoice: '',
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        imageWidth: 1100,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: {}
                    };
                    $scope.survey[3][3] = {
                        survey: 3,
                        nr: 3,
                        type: 'radiolist',
                        text: "3) I’m afraid I ……… here for your birthday party.",
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur3q3Choices,
                        freeChoice: '',
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        imageWidth: 1100,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: {}
                    };
                    $scope.survey[3][4] = {
                        survey: 3,
                        nr: 4,
                        type: 'radiolist',
                        text: "4) How ……… are you?",
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur3q4Choices,
                        freeChoice: '',
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        imageWidth: 1100,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: {}
                    };
                    $scope.survey[3][5] = {
                        survey: 3,
                        nr: 5,
                        type: 'radiolist',
                        text: "5) Would you like ……… help? ",
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur3q5Choices,
                        freeChoice: '',
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        imageWidth: 1100,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: {}
                    };
                    $scope.survey[3][6] = {
                        survey: 3,
                        nr: 6,
                        type: 'radiolist',
                        text: "6) He hasn’t played since he ……… the accident. ",
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur3q6Choices,
                        freeChoice: '',
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        imageWidth: 1100,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: {}
                    };
                    $scope.survey[3][7] = {
                        survey: 3,
                        nr: 7,
                        type: 'radiolist',
                        text: "7) In life ……… can make a mistake; we’re all human. ",
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur3q7Choices,
                        freeChoice: '',
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        imageWidth: 1100,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: {}
                    };
                    $scope.survey[3][8] = {
                        survey: 3,
                        nr: 8,
                        type: 'radiolist',
                        text: "8) If he ……… about it, I’m sure he’d help. ",
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur3q8Choices,
                        freeChoice: '',
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        imageWidth: 1100,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: {}
                    };
                    $scope.survey[3][9] = {
                        survey: 3,
                        nr: 9,
                        type: 'radiolist',
                        text: "9) They said they ……… come, but they didn’t.",
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur3q9Choices,
                        freeChoice: '',
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        imageWidth: 1100,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: {}
                    };
                    $scope.survey[3][10] = {
                        survey: 3,
                        nr: 10,
                        type: 'radiolist',
                        text: " 10) I don't have a cent to give you. I ...... bought a new computer. ",
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur3q10Choices,
                        freeChoice: '',
                        activate: [],
                        showImage: false,
                        imageURL: '',
                        imageWidth: 1100,
                        value: '',
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: {}
                    };

                } //PostSurvey1 Englisch Test
                if (false) {
                    $scope.sur6q0Choices = randomize(["Bei Crowdjump konnte ich so vorgehen, wie ich es wollte.",
                        "Crowdjump war unterhaltsam.",
                        "Mit meiner Leistung in Crowdjump bin ich zufrieden.",
                        "Bei Crowdjump stellte ich mich geschickt an.",
                        "Bei Crowdjump fühlte ich mich unter Druck.",
                        "Ich glaube, ich war bei Crowdjump ziemlich gut.",
                        "Ich hatte Bedenken, ob ich Crowdjump gut hinbekomme.",
                        "Ich konnte Crowdjump selbst steuern.",
                        "Ich fand Crowdjump sehr interessant.",
                        "Crowdjump hat mir Spaß gemacht.",
                        "Bei Crowdjump konnte ich wählen, wie ich es mache.",
                        "Bei Crowdjump fühlte ich mich angespannt."]);
                    $scope.survey[6][0] = {
                        survey: 6,
                        nr: 0,
                        type: 'scale',
                        text: 'Bitte bewerte, wie du über folgende Aussagen bezüglich der Teilnahme an Crowdjump denkst, auf einer Skala von "stimmt gar nicht" bis "stimmt völlig". ',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur6q0Choices,
                        scale: scale5de,
                        nrscales: 5,
                        freeChoice: '',
                        activate: [],
                        value: '',
                        showImage: false,
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };

                } //PostSurvey4DE
                if (false) {
                    $scope.sur7q0Scale = ["Stimme überhaupt nicht zu", "", "", "", "Stimme voll zu"]
                    $scope.sur7q0Choices = ["Ich denke, dass ich das System gerne häufig benutzen würde.",
                        "Ich fand das System unnötig komplex.",
                        "Ich fand das System einfach zu benutzen.",
                        "Ich glaube, ich würde die Hilfe einer technisch versierten Person benötigen, um das System benutzen zu können.",
                        "Ich fand, die verschiedenen Funktionen in diesem System waren gut integriert.",
                        "Ich denke, das System enthielt zu viele Inkonsistenzen.",
                        "Ich kann mir vorstellen, dass die meisten Menschen den Umgang mit diesem System sehr schnell lernen.",
                        "Ich fand das System sehr umständlich zu nutzen.",
                        "Ich fühlte mich bei der Benutzung des Systems sehr sicher",
                        "Ich musste eine Menge lernen, bevor ich anfangen konnte das System zu verwenden."
                    ];
                    $scope.survey[7][0] = {
                        survey: 7,
                        nr: 0,
                        type: 'scale',
                        text: 'Bitte bewerte, wie du über folgende Aussagen bezüglich der Teilnahme an Crowdjump denkst, auf einer Skala von "stimmt gar" nicht bis "stimmt völlig". ',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur7q0Choices,
                        scale: $scope.sur7q0Scale,
                        nrscales: 5,
                        freeChoice: '',
                        activate: [],
                        value: '',
                        showImage: false,
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };

                } //PostSurvey5DE
                if (false) {
                    $scope.sur8q0Choices = randomize(["Mir gefällt die Idee hinter Crowdjump.",
                        "Ich habe gerne neue Ideen vorgeschlagen.",
                        "Das Spiel hat sich in eine positive Richtung entwickelt.",
                        "Die Website hat sich in eine positive Richtung entwickelt.",
                        "Das Verfahren zum Auswählen der zu implementierenden Ideen hat sich in eine positive Richtung entwickelt.",
                        "Nach einer Abstimmung wurden die Features wie gewünscht umgesetzt.",
                        "Die umgesetzten Features entsprachen dem, was ich mir auch für Crowdjump gewünscht habe.",
                        "Ich habe mit den anderen Spielern zusammen eine Gemeinschaft gebildet.",
                        "Andere Spieler haben die Entwicklung behindert.",
                        "Die anderen Spieler und ich haben als Team gearbeitet.",
                        "Meine Meinung wurde nicht angehört.",
                    ]);
                    $scope.sur8q0Scale = ["Stimme nicht zu", "Stimme eher nicht zu", "Stimme weder zu noch lehne ab", "Stimme eher zu", "Stimme zu"]
                    $scope.survey[8][0] = {
                        survey: 8,
                        nr: 0,
                        type: 'scale',
                        text: 'Bewerte die folgenden Aussagen über deine Erfahrung mit Crowdjump auf einer Skala von "Stimme nicht zu" bis "Stimme zu". ',
                        required: true,
                        startVisible: true,
                        visible: true,
                        choices: $scope.sur8q0Choices,
                        scale: scale5de,
                        nrscales: 5,
                        freeChoice: '',
                        activate: [],
                        value: '',
                        showImage: false,
                        checked: false,
                        error: false,
                        activatedBy: new Set(),
                        selected: [{}]
                    };

                } //PostSurvey6DE
            }

        }


    }

)();