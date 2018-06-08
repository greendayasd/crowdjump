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

        if (!vm.isAuthenticated && vm.url.includes("survey")) {
            // console.log(vm.url);
            window.location.href = '/';
            return;
        }

        if (!vm.isAuthenticated) {
            return;
        }


        // console.log(vm.url);
        vm.surveystatus = vm.cookie["survey_status"];
        // console.log(vm.surveystatus);
        if (vm.surveystatus < 3 && !vm.url.includes("survey" + vm.surveystatus)) {
            window.location.href = '/survey' + vm.surveystatus;
        }
        if (vm.surveystatus >= 3 && vm.url.includes("survey")){
            window.location.href = '/';

        }


        $scope.submit = function (next_survey) {

            var content = {};
            if ($scope.checkAll(vm.surveystatus)) {
                content = $scope.getContent(vm.surveystatus);
                // console.log(content);

            } else {
                alert("Bitte fülle zuerst alle Pflichtfragen aus!");
                return;

            }
            Questionnaire.post_preSite(vm.cookie["id"], vm.surveystatus, content);

            Questionnaire.increase_surveycount(vm.cookie["username"], next_survey);
            if (vm.surveystatus < 2) {
                vm.surveystatus = next_survey;
                window.location.href = '/survey' + next_survey;
            } else {
                window.location.href = '/surveyPreFinished';
            }
        }

        //false when error
        $scope.checkAll = function (sur) {
            var error = false;
            for (var i = 0; i < $scope.survey[sur].length; i++) {
                var q = $scope.survey[sur][i];
                // console.log(q);
                if (!q.checked && q.required && q.visible) {
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
                if (q.type === 'check') {
                    var values = '';
                    $.each(q.selected, function (index, value) {
                        if (value) {
                            if (index == q.choices.length) {
                                values += q.value;
                            } else {
                                values += q.choices[index] + ',';
                            }
                        }
                    });
                    content.push('[' + values + ']');
                } else if (q.type === 'radiolist') {
                    if (q.selected == q.choices.length) {
                        content.push(q.value);
                    } else {
                        content.push(q.choices[q.selected]);
                    }
                } else if (q.type === 'scale' || q.type === 'doublescale') {
                    content.push(JSON.stringify(q.selected));
                } else {
                    content.push(q.value);
                }

            }
            return content.toString();
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
                if (q.selected > 0) {
                    q.checked = true;
                }
            }

            if (q.type === 'scale' || q.type === 'doublescale') {
                var notChecked = false;
                for (var i = 0; i < q.nrscales; i++) {
                    if (q.selected[i] < 0) {
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

        $scope.test = function () {
            // Questionnaire.post_preSite(vm.cookie["id"], 1, "asd");
            console.log("test");
            // Questionnaire.cookieasd();
        }

        $scope.test2 = function () {
            console.log($scope.getContent(1));
        }
        $scope.getNumber = function (num) {
            return new Array(num);
        }

        //questions
        var choice = "Bitte auswählen...";
        var scale7 = ["überhaupt nicht", , , , , , "sehr"];
        var scale7AB = ["A", , , , , , "B"];

        $scope.survey = [];
        $scope.survey[0] = [];
        $scope.survey[1] = [];
        $scope.survey[2] = [];
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
            scale: $scope.sur1q3Scale,
            nrscales: 7,
            freeChoice: 'Andere',
            activate: [{v: 1, s: 1, nr: 1}],
            showImage: false,
            imageURL: 'http://wallpaperget.com/images/super-mario-world-wallpaper-24.jpg',
            imageWidth: 1100,
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
            imageURL: 'http://wallpaperget.com/images/super-mario-world-wallpaper-24.jpg',
            imageWidth: 1100,
            value: '',
            checked: false,
            error: false,
            activatedBy: new Set(),
            selected: [{}]
        };

        if (true) {
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
                required: true,
                startVisible: false,
                visible: false,
                activate: [],
                showImage: false,
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
                value: '-1',
                checked: false,
                error: false,
                activatedBy: new Set(),
            };
        } //Survey1

        if (true) {
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
                value: '',
                checked: false,
                error: false,
                activatedBy: new Set(),
                selected: [{}]
            };

        } //Survey2
    }


})();