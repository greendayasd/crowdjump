(function () {
    'use strict';

    angular
        .module('crowdjump.layout.controllers')
        .controller('IndexController', IndexController);

    IndexController.$inject = ['$scope', 'Authentication', 'Ideas', 'Snackbar', '$cookies'];

    function IndexController($scope, Authentication, Ideas, Snackbar, $cookies) {
        var vm = this;

        vm.isAuthenticated = Authentication.isAuthenticated();
        // console.error(vm.isAuthenticated || false);
        vm.cookie = $cookies.getObject('authenticatedAccount');
        vm.ideas = [];
        activate();
        // console.error("index");

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
                // Snackbar.show('Test');
                console.error('Test');
            }

            function ideasErrorFn(data, status, headers, config) {
                Snackbar.error(data.error);
            }
        }
    }
})();