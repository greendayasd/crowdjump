(function () {
    'use strict';

    angular
        .module('crowdjump.utils', [
            'crowdjump.utils.services',
            'crowdjump.utils.controllers'
        ]);

    angular
        .module('crowdjump.utils.services', []);

    angular
        .module('crowdjump.utils.controllers', ['ngAnimate', 'ngSanitize', 'ui.bootstrap']);
})();