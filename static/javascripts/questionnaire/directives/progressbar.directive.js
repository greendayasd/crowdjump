(function () {
    'use strict';

    angular
        .module('crowdjump.questionnaire.directives')
        .directive('surProgress', surProgress);

    function surProgress() {

        var directive = {
            restrict: 'EA',
            scope: {
                progress: '@info'
            },
            templateUrl: '/static/templates/questionnaire/directives/progressbar.html',
            controller: 'QuestionnaireController'
        };

        return directive;
    }
})();