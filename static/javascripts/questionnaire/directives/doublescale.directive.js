(function () {
    'use strict';

    angular
        .module('crowdjump.questionnaire.directives')
        .directive('surDoubleScale', surDoubleScale);

    function surDoubleScale() {

        var directive = {
            restrict: 'EA',
            scope: {
                question: '=info'
            },
            templateUrl: '/static/templates/questionnaire/directives/doublescale.html',
            controller: 'QuestionnaireController'
        };

        return directive;
    }
})();