(function () {
    'use strict';

    angular
        .module('crowdjump.statistics.controllers')
        .controller('StatisticsController', StatisticsController);

    StatisticsController.$inject = ['$scope', 'Authentication', 'Statistics'];

    function StatisticsController($scope, Authentication, Statistics) {
        var vm = this;

        $scope.statistics = [];


        activate();



        function activate() {
            Statistics.top(5).then(statisticsSuccessFn, statisticsErrorFn);

            $scope.$on('statistics.created', function (event, statistics) {
                $scope.history.unshift(statistics);
            });

            $scope.$on('statistics.created.error', function () {
                $scope.history.shift();
            });

            function statisticsSuccessFn(data, status, headers, config) {
                $scope.statistics = data.data["results"];

            }

            function statisticsErrorFn(data, status, headers, config) {
                console.error(data.error);
            }
        }
    }
})();