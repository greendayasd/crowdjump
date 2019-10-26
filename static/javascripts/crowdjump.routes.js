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

        }).when('/game2', {
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

        }).when('/profile', {
            controller: 'ProfileController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/layout/profile.html'

        }).when('/bugreports', {
            controller: 'BugreportController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/layout/bugreport.html'


        }).when('/data', {
            controller: 'DataController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/layout/data.html'
        }).when('/admin', {
            controller: 'AdminController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/layout/admin.html'
        }).when('/bgg', {
            controller: 'BggController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/layout/bgg.html'


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
        }).when('/surveyPreFinished', {
            controller: 'QuestionnaireController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/questionnaire/surveyPreFinished.html'
        }).when('/postsurvey0', {
            controller: 'QuestionnaireController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/questionnaire/postsurvey0.html'
        }).when('/postsurvey1', {
            controller: 'QuestionnaireController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/questionnaire/postsurvey1.html'
        }).when('/postsurvey2', {
            controller: 'QuestionnaireController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/questionnaire/postsurvey2.html'
        }).when('/postsurvey3', {
            controller: 'QuestionnaireController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/questionnaire/postsurvey3.html'
        }).when('/postsurvey4', {
            controller: 'QuestionnaireController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/questionnaire/postsurvey4.html'
        }).when('/postsurvey5', {
            controller: 'QuestionnaireController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/questionnaire/postsurvey5.html'
        }).when('/postsurvey6', {
            controller: 'QuestionnaireController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/questionnaire/postsurvey6.html'
        }).when('/surveyPostFinished', {
            controller: 'QuestionnaireController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/questionnaire/surveyPostFinished.html'


        }).when('/mobile', {
            controller: 'QuestionnaireController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/layout/mobile.html'
        }).when('/oldbrowser', {
            controller: 'QuestionnaireController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/layout/oldbrowser.html'
        }).when('/unsubscribe', {
            controller: 'UnsubscribeController',
            controllerAs: 'vm',
            templateUrl: '/static/templates/layout/unsubscribe.html'
        })
            .otherwise('/');
    }
})();