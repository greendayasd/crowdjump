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


        window.mobileAndTabletcheck = function () {
            var check = false;
            (function (a) {
                if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
            })(navigator.userAgent || navigator.vendor || window.opera);
            console.log(check);
            return check;
        };
        mobileAndTabletcheck();

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
        var post_surveystatus = vm.surveystatus - 4;
        // console.log(vm.surveystatus);
        if (vm.surveystatus < 3 && !vm.url.includes("survey" + vm.surveystatus)) {
            window.location.href = '/survey' + vm.surveystatus;
        }
        else if (vm.surveystatus > 3 && vm.surveystatus < 11 && !vm.url.includes("postsurvey" + post_surveystatus)) {
            window.location.href = 'postsurvey' + post_surveystatus;
        }
        else if ((vm.surveystatus == 3 || vm.surveystatus == 3) && vm.url.includes("survey") && !vm.url.includes("surveyPreFinished")) {
            window.location.href = '/';
        }

        // else if (vm.surveystatus > 3 && !vm.url.includes("postsurvey" + vm.surveystatus)) {
        //     console.log(vm.surveystatus);
        //     window.location.href = '/survey' + vm.surveystatus;
        // }


        $scope.submit = function (next_survey) {

            var content = {};
            // console.log(vm.surveystatus);
            var post_check = vm.surveystatus;
            var next_survey_id = next_survey;

            if (vm.surveystatus >= 3) {

                post_check = vm.surveystatus - 2;
                next_survey_id += 4;
            }

            if (vm.surveystatus < 3 && $scope.checkAll(post_check)) {
                content = $scope.getContent(post_check);
                // console.log(content);
                // console.log(vm.surveystatus);
                Questionnaire.post_preSite(vm.cookie["id"], vm.surveystatus, content);

            } else if (vm.surveystatus == 4) {
                Questionnaire.post_postSite(vm.cookie["id"], 0, '');

            }
            else if ($scope.checkAll(post_check)) {
                content = $scope.getContent(post_check);
                // console.log(content);
                Questionnaire.post_postSite(vm.cookie["id"], post_check - 2, content);

            } else if (vm.surveystatus != 3 && vm.surveystatus != 4 && vm.surveystatus != 11) {
                alert("Bitte fülle zuerst alle Pflichtfragen aus!");
                return;

            }

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
            console.log(q.selected);
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

        $scope.test = function () {
            // Questionnaire.post_preSite(vm.cookie["id"], 1, "asd");
            console.log("test");
            // Questionnaire.cookieasd();
        }

        $scope.test2 = function () {
            console.log($scope.getContent(1));
        }
        $scope.test3 = function (a) {
            console.log($scope.selected[a]);
        }
        $scope.getNumber = function (num) {
            return new Array(num);
        }

        $scope.question2 = ["Chicken", "Egg", "Bacon"];
        $scope.choices = ["Test", "asd", "123"];
        $scope.selected = [];

        //questions
        var choice = "Bitte auswählen...";
        var scale5 = ["not at all", "slightly", "moderately", "fairly", "extremely"];
        var scale5de = ["stimmt gar nicht", "stimmt wenig", "stimmt teils-teils", "stimmt ziemlich", "stimmt völlig"]
        var scale7 = ["überhaupt nicht", , , , , , "sehr"];
        var scale7AB = ["A", , , , , , "B"];

        $scope.survey = [];
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

        //Pre Survey
        $scope.survey[0] = [];
        $scope.survey[1] = [];
        $scope.survey[2] = [];

        if (true) {
            $scope.sur0q0Choices = ["Ich habe die Hinweise zum Datenschutz und die Teilnahmeinformationen gelesen, verstanden und bin damit einverstanden, dass meine Daten für wissenschaftliche Forschungszwecke anonymisiert verwendet werden dürfen. "];
            $scope.survey[0][0] = {
                survey: 0,
                nr: 0,
                type: 'check',
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

        } //Survey0

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


        //Post Survey +3
        $scope.survey[3] = [];
        $scope.survey[4] = [];
        $scope.survey[5] = [];
        $scope.survey[6] = [];
        $scope.survey[7] = [];
        $scope.survey[8] = [];
        $scope.survey[9] = [];

        if (true) {
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

        } //Survey1

        if (true) {
            $scope.sur4q0Choices = ["I felt challenged",
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
                "I enjoyed it"];
            $scope.survey[4][0] = {
                survey: 4,
                nr: 0,
                type: 'scale',
                text: 'Please indicate how you felt while playing the game for each of the items, on the following scale. ',
                required: true,
                startVisible: true,
                visible: true,
                choices: $scope.sur4q0Choices,
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

        } //Survey2

        if (true) {
            $scope.sur5q0Choices = ["I found it enjoyable to be with the other(s)",
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
                "The other’s intentions were clear to me"];
            $scope.survey[5][0] = {
                survey: 5,
                nr: 0,
                type: 'scale',
                text: 'Please rate the following statements on a scale from "not at all" to "extremely". ',
                required: true,
                startVisible: true,
                visible: true,
                choices: $scope.sur5q0Choices,
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

        } //Survey3

        if (true) {
            $scope.sur6q0Choices = ["Bei Crowdjump konnte ich so vorgehen, wie ich es wollte.",
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
                "Bei Crowdjump fühlte ich mich angespannt."];
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

        } //Survey4

        if (true) {
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

        } //Survey5

        if (true) {
            $scope.sur8q0Choices = ["Mir gefällt die Idee hinter Crowdjump.",
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
            ];
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

        } //Survey6
    }


})();