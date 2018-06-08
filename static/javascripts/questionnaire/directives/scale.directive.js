(function () {
    'use strict';

    angular
        .module('crowdjump.questionnaire.directives')
        .directive('surScale', surScale);

    function surScale() {

        var directive = {
            restrict: 'EA',
            scope: {
                question: '=info'
            },
            templateUrl: '/static/templates/questionnaire/directives/scale.html',
            controller: 'QuestionnaireController'
        };

        return directive;
    }
})();