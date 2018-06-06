(function () {
    'use strict';

    angular
        .module('crowdjump.questionnaire.directives')
        .directive('surCombo', surCombo);

    function surCombo() {

        var directive = {
            restrict: 'EA',
            scope: {
                question: '=info'
            },
            templateUrl: '/static/templates/questionnaire/directives/combobox.html',
            controller: 'QuestionnaireController'
        };

        return directive;
    }
})();