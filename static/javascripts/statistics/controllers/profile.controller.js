(function () {
    'use strict';

    angular
        .module('crowdjump.statistics.controllers')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$scope', 'Authentication', 'Statistics'];

    function ProfileController($scope, Authentication, Statistics) {
        var vm = this;

        vm.isAuthenticated = Authentication.isAuthenticated();
        vm.cookie = Authentication.getAuthenticatedAccount();
        $scope.username = vm.cookie["username"];

        $scope.statistics = [];


        activate();

        function activate() {
            Statistics.get($scope.username).then(statisticsSuccessFn, statisticsErrorFn);

            $scope.$on('statistics.created', function (event, statistics) {
                $scope.history.unshift(statistics);
            });

            $scope.$on('statistics.created.error', function () {
                $scope.history.shift();
            });

            function statisticsSuccessFn(data, status, headers, config) {
                $scope.statistics = data.data;
                console.log(data.data);

            }

            function statisticsErrorFn(data, status, headers, config) {
                console.error(data.error);
            }
        }
    }
})();