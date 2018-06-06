(function () {
    'use strict';

    angular
        .module('crowdjump.questionnaire.directives')
        .directive('surCheck', surCheck);

    function surCheck() {

        var directive = {
            restrict: 'EA',
            scope: {
                question: '=info'
            },
            templateUrl: '/static/templates/questionnaire/directives/check.html',
            controller: 'QuestionnaireController'
        };

        return directive;
    }
})();