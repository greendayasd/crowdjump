(function () {
    'use strict';

    angular
        .module('crowdjump.questionnaire.controllers')
        .controller('QuestionnaireController', QuestionnaireController);

    QuestionnaireController.$inject = ['$scope', 'Authentication', 'Questionnaire'];

    function QuestionnaireController($scope, Authentication, Questionnaire) {
        var vm = this;

        vm.isAuthenticated = Authentication.isAuthenticated();
        if (!vm.isAuthenticated) {
            return;
        }
        vm.cookie = Authentication.getAuthenticatedAccount();
        vm.surveystatus = vm.cookie["survey_status"];
        vm.url = window.location.pathname;
        // console.log(vm.url);
        // $rootScope.$on("$routeChangeStart", console.log("test"));
        if (vm.surveystatus <= 9 && !vm.url.includes("survey" + vm.surveystatus)) {
            window.location.href = '/survey' + vm.surveystatus;
        }

        // activate();

        $scope.submit = function (next_survey) {
            Questionnaire.increase_surveycount(vm.cookie["username"], next_survey);
            if (vm.surveystatus <= 9) {
                window.location.href = '/survey' + next_survey;
            }
        }
    }
})();