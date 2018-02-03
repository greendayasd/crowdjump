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
        ]);

    angular
        .module('crowdjump.config', []);

    angular
        .module('crowdjump.routes', ['ngRoute']);


    angular
        .module('crowdjump')
        .run(run);

    run.$inject = ['$http'];

    /**
     * @name run
     * @desc Update xsrf $http headers to align with Django's defaults
     */
    function run($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    }
})();
