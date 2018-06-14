(function () {
    'use strict';

    angular
        .module('crowdjump.history.controllers')
        .controller('HistoryController', HistoryController);

    HistoryController.$inject = ['$scope', 'Authentication', 'History'];

    function HistoryController($scope, Authentication, History) {
        var vm = this;

        $scope.history = [];
        $scope.version = '';
        $scope.choices = ["1", "2", "3"];
        $scope.question2 = ["A", "V", "C"];

        getVersion();

        function getVersion() {
            History.newest().then(historySuccessFn, historyErrorFn);

            $scope.$on('history.created', function (event, history) {
                $scope.history.unshift(history);
            });

            $scope.$on('history.created.error', function () {
                $scope.history.shift();
            });

            function historySuccessFn(data, status, headers, config) {
                $scope.history = data.data;
                $scope.version = data.data["results"][0];          }

            function historyErrorFn(data, status, headers, config) {
                // console.error(data.error);
            }
        }
    }
})();