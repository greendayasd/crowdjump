(function () {
    'use strict';

    angular
        .module('crowdjump.admin', [
            'crowdjump.admin.controllers',
        ]);

    angular
        .module('crowdjump.admin.controllers', ['ngCookies']);

})();