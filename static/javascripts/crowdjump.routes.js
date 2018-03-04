(function () {
    'use strict';

    angular
        .module('crowdjump.routes')
        .config(config);

    config.$inject = ['$routeProvider'];

    /**
     * @name config
     * @desc Define valid application routes
     */
    function config($routeProvider) {
        $routeProvider.when('/register', {
            controller: 'RegisterController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/authentication/register.html'
            
        }).when('/login', {
            controller: 'LoginController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/authentication/login.html'

        }).when('/', {
            controller: 'IndexController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/layout/index.html'

        }).when('/history', {
            controller: 'HistoryController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/p_history.html'

        }).when('/game', {
            controller: 'GameController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/layout/p_main.html'

        }).when('/ideas', {
            controller: 'IdeasController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/layout/idea_index.html'
        })
            .otherwise('/');
    }
})();