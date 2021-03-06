(function () {
    'use strict';

    angular
        .module('crowdjump.questionnaire.directives')
        .directive('surRadio', surRadio);

    function surRadio() {

        var directive = {
            restrict: 'EA',
            scope: {
                question: '=info'
            },
            templateUrl: '/static/templates/questionnaire/directives/radio.html',
            controller: 'QuestionnaireController'
        };

        return directive;
    }
})();