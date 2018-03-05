/**
 * IndexController
 * @namespace crowdjump.layout.controllers
 */
(function () {
    'use strict';

    angular
        .module('crowdjump.ideas.controllers')
        .controller('IdeasIndexController', IdeasIndexController);

    IdeasIndexController.$inject = ['$scope', 'Authentication', 'Ideas', 'Snackbar', '$cookies'];

    function IdeasIndexController($scope, Authentication, Ideas, Snackbar, $cookies) {
        var vm = this;

        vm.isAuthenticated = Authentication.isAuthenticated();
        // console.error("ideas " + vm.isAuthenticated || false);
        vm.cookie = $cookies.getObject('authenticatedAccount');
        vm.ideas = [];
        activate();
        // console.error("ideas");

        function activate() {
            Ideas.all().then(ideasSuccessFn, ideasErrorFn);

            $scope.$on('idea.created', function (event, idea) {
                vm.ideas.unshift(idea);
            });

            $scope.$on('idea.created.error', function () {
                vm.ideas.shift();
            });

            function ideasSuccessFn(data, status, headers, config) {
                vm.ideas = data.data;
                // console.error("data " + data.data);
            }

            function ideasErrorFn(data, status, headers, config) {
                Snackbar.error(data.error);
                console.error(data.error);
            }
        }
    }
})();