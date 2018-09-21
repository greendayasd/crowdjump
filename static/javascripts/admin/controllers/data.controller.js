(function () {
        'use strict';

        angular
            .module('crowdjump.admin.controllers')
            .controller('DataController', DataController);

        DataController.$inject = ['$scope', 'Authentication', 'Questionnaire', 'Ideas', 'Comments', 'History', 'Votes'];

        function DataController($scope, Authentication) {
            var vm = this;
            vm.isAuthenticated = Authentication.isAuthenticated();
            vm.cookie = Authentication.getAuthenticatedAccount();
            vm.url = window.location.pathname;
        }


    }

)();