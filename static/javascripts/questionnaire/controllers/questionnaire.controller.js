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
        if (vm.surveystatus <= 3 && !vm.url.includes("survey" + vm.surveystatus)) {
            // window.location.href = '/survey' + vm.surveystatus;
        }


        $scope.submit = function (next_survey) {

            var content = {};
            console.log(vm.surveystatus);
            if ($scope.checkAll(vm.surveystatus)) {
                content = $scope.getContent(vm.surveystatus);

            } else {
                alert("Bitte fülle zuerst alle Pflichtfragen aus!");
                return;

            }


            Questionnaire.increase_surveycount(vm.cookie["username"], next_survey);
            if (vm.surveystatus <= 3) {
                vm.surveystatus = next_survey;
                window.location.href = '/survey' + next_survey;
            } else {
                window.location.href = '/';
            }
        }

        //false when error
        $scope.checkAll = function (sur) {
            var error = false;
            for (var i = 0; i < $scope.survey[sur].length; i++) {
                var q = $scope.survey[sur][i];
                // console.log(q);
                if (!q.checked && q.required) {
                    error = true;
                    q.error = true;
                } else {
                    q.error = false;
                }
                // console.log(q.checked);
            }
            return !error;
        }

        $scope.getContent = function (sur){
            var content = [];
            for (var i = 0; i < $scope.survey[sur].length; i++) {
                var q = $scope.survey[sur][i];
                content.push(q.value);

            }
            console.log(content.toString());
            return content.toString();
        }

        $scope.checkconditions = function (q) {
            // console.log(q.value);
            if (q.type === 'radio'){
                if (q.value == 0 || q.value == 1){
                    q.checked = true;
                } else {
                    q.checked = false;
                }
            }

            if (q.type === 'check'){
                // console.log(q.selected);
                // console.log(q.value);
                // for alle if true then checked
            }

            if (q.type === "combo") {
                if (q.value === choice) {
                    q.checked = false;
                } else {
                    q.checked = true;
                }
            }

            if (q.type === "text") {
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
            $scope.getContent(1);
        }


        //questions
        var choice = "Bitte auswählen...";
        // $scope.selectedChoice = [];
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

        $scope.survey = [];
        $scope.survey[0] = [];
        $scope.survey[1] = [];
        $scope.sur1q0Choices = ["Story", "Grafik", "Innovation", "Mehrspieler-Modus", "Wettbewerb mit anderen Spielern", "Schwierigkeit", "Gameplay/Spielablauf"];
        $scope.survey[1][0] = {
            survey: 1,
            nr: 0,
            type: 'check',
            text: 'Was sind deiner Meninung nach die wichtigsten Aspekte in einem Videospiel?',
            required: true,
            startVisible: true,
            visible: true,
            choices: $scope.sur1q0Choices,
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
        $scope.survey[1][1] = {
            survey: 1,
            nr: 1,
            checked: false,
            type: 'text',
            text: 'Text2',
            required: false,
            startVisible: false,
            visible: false,
            minLength: 1,
            activate: [],
            value: '',
            error: false,
            activatedBy: new Set(),
        };
        $scope.sur1q2Choices = [choice, "< 18", "18 - 26", "26 - 39", "> 40"];
        $scope.survey[1][2] = {
            survey: 1,
            nr: 2,
            checked: false,
            type: 'combo',
            text: 'Alter',
            required: true,
            startVisible: true,
            visible: true,
            choices: $scope.sur1q2Choices,
            activate: [],
            value: '',
            error: false,
            activatedBy: new Set(),
        };
        $scope.sur1q3Choices = [choice, "weiblich", "männlich", "sonstiges"];
        $scope.survey[1][3] = {
            survey: 1,
            nr: 3,
            checked: false,
            type: 'combo',
            text: 'Geschlecht',
            required: false,
            startVisible: true,
            visible: true,
            choices: $scope.sur1q3Choices,
            activate: [],
            value: '',
            error: false,
            activatedBy: new Set(),
        };
    }


})();