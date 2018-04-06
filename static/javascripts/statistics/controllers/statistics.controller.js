(function () {
    'use strict';

    angular
        .module('crowdjump.statistics.controllers')
        .controller('StatisticsController', StatisticsController);

    StatisticsController.$inject = ['$scope', 'Authentication', 'Statistics', 'History', 'Snackbar', '$cookies'];

    function StatisticsController($scope, Authentication, Statistics, History, Snackbar, $cookies) {
        var vm = this;

        $scope.statistics = [];


        activate();



        function activate() {
            Statistics.all().then(statisticsSuccessFn, statisticsErrorFn);

            $scope.$on('statistics.created', function (event, statistics) {
                $scope.history.unshift(statistics);
            });

            $scope.$on('statistics.created.error', function () {
                $scope.history.shift();
            });

            function statisticsSuccessFn(data, status, headers, config) {
                $scope.statistics = data.data;
                // console.error("data " + data.data);

            }

            function statisticsErrorFn(data, status, headers, config) {
                Snackbar.error(data.error);
                console.error(data.error);
            }
        }
    }
})();