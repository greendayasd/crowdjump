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
            templateUrl: '/static/templates/layout/history.html',
            withLogin: true

        }).when('/game', {
            controller: 'GameController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/layout/game.html'

        }).when('/chat', {
            controller: 'ChatController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/chat.html'

        }).when('/chat/:roomname', {
            controller: 'ChatController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/chat/room.html'

        }).when('/chatroom', {
            controller: 'ChatController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/chatroom.html'

        }).when('/ideas', {
            controller: 'IdeasIndexController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/layout/idea_index.html'


            //surveys
        }).when('/survey0', {
            controller: 'QuestionnaireController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/questionnaire/survey0.html'

        }).when('/survey1', {
            controller: 'QuestionnaireController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/questionnaire/survey1.html'
        }).when('/survey2', {
            controller: 'QuestionnaireController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/questionnaire/survey2.html'
        })
            .otherwise('/');
    }
})();