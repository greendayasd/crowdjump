(function () {
    'use strict';

    angular
        .module('crowdjump.questionnaire', [
            'crowdjump.questionnaire.controllers',
            'crowdjump.questionnaire.services'
        ]);

    angular
        .module('crowdjump.questionnaire.controllers', ['ngCookies']);

    angular
        .module('crowdjump.questionnaire.services', []);
})();