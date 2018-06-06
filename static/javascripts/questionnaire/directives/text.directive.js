(function () {
    'use strict';

    angular
        .module('crowdjump.questionnaire.directives')
        .directive('surText', surText);

    function surText() {

        var directive = {
            restrict: 'EA',
            scope: {
                question: '=info'
            },
            templateUrl: '/static/templates/questionnaire/directives/text.html',
            controller: 'QuestionnaireController'
        };

        return directive;
    }
})();