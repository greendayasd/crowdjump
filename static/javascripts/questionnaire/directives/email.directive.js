(function () {
    'use strict';

    angular
        .module('crowdjump.questionnaire.directives')
        .directive('surEmail', surEmail);

    function surEmail() {

        var directive = {
            restrict: 'EA',
            scope: {
                question: '=info'
            },
            templateUrl: '/static/templates/questionnaire/directives/email.html',
            controller: 'QuestionnaireController'
        };

        return directive;
    }
})();