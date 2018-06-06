(function () {
    'use strict';

    angular
        .module('crowdjump.questionnaire', [
            'crowdjump.questionnaire.controllers',
            'crowdjump.questionnaire.services',
            'crowdjump.questionnaire.directives'
        ]);

    angular
        .module('crowdjump.questionnaire.controllers', ['ngCookies']);

    angular
        .module('crowdjump.questionnaire.services', ['ngCookies']);

    angular
        .module('crowdjump.questionnaire.directives', []);
})();