(function () {
    'use strict';

    angular
        .module('crowdjump.questionnaire.directives')
        .directive('surBigText', surBigText);

    function surBigText() {

        var directive = {
            restrict: 'EA',
            scope: {
                question: '=info'
            },
            templateUrl: '/static/templates/questionnaire/directives/bigtext.html',
            controller: 'QuestionnaireController'
        };

        return directive;
    }
})();