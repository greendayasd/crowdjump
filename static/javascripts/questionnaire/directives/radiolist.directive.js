(function () {
    'use strict';

    angular
        .module('crowdjump.questionnaire.directives')
        .directive('surRadiolist', surRadiolist);

    function surRadiolist() {

        var directive = {
            restrict: 'EA',
            scope: {
                question: '=info'
            },
            templateUrl: '/static/templates/questionnaire/directives/radiolist.html',
            controller: 'QuestionnaireController'
        };

        return directive;
    }
})();