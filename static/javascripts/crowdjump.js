(function () {
    'use strict';

    angular
        .module('crowdjump', [
            'crowdjump.config',
            'crowdjump.routes',
            'crowdjump.authentication',
            'crowdjump.layout',
            'crowdjump.ideas',
            'crowdjump.utils',
            'crowdjump.history',
            'crowdjump.game',
            'crowdjump.version',
        ]);

    angular
        .module('crowdjump.config', []);

    angular
        .module('crowdjump.routes', ['ngRoute']);


    angular
        .module('crowdjump')
        .run(run);

    run.$inject = ['$http'];

    function run($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    }
})();
