(function () {
    'use strict';

    angular
        .module('crowdjump.statistics.controllers')
        .controller('ProfileController', ProfileController);

    ProfileController.$inject = ['$scope', 'Authentication', 'Statistics', 'History'];

    function ProfileController($scope, Authentication, Statistics, History) {
        var vm = this;

        vm.isAuthenticated = Authentication.isAuthenticated();
        if (!vm.isAuthenticated) window.location.href = '/';

        vm.cookie = Authentication.getAuthenticatedAccount();
        $scope.username = vm.cookie["username"];

        $scope.statistics = [];
        $scope.current_statistic = [];
        $scope.versions = [];


        activate();

        function activate() {
            Statistics.get($scope.username).then(statisticsSuccessFn, statisticsErrorFn);
            // get_versions();
            changeGamedataVersion(versionnumber);

            $scope.$on('statistics.created', function (event, statistics) {
                $scope.history.unshift(statistics);
            });

            $scope.$on('statistics.created.error', function () {
                $scope.history.shift();
            });

            function statisticsSuccessFn(data, status, headers, config) {
                $scope.statistics = data.data;
                // console.log(data.data);

            }

            function statisticsErrorFn(data, status, headers, config) {
                console.error(data.error);
            }
        }

        function get_versions() {
            History.all().then(historySuccessFn, historyErrorFn);

            function historySuccessFn(data, status, headers, config) {
                $scope.versions = data.data;
                $scope.versions_max = data.data;
                // $scope.versions.unshift({id: -1, label: "all"});
                $scope.newestVersion = $scope.versions[0];


            }

            function historyErrorFn(data, status, headers, config) {
                console.error(data.error);
            }
        }


        function changeGamedataVersion (version){
            console.log($scope.statistics[0]);
            $scope.current_statistic = $scope.statistics[getGamedataIDFromVersion(version)];
        }

        function getGamedataIDFromVersion (version){
            for (var i = 0; i < $scope.statistics.length; i++){
                console.log($scope.statistics[i]);
                if ($scope.statistics[i].version.id == version) return i;
            }
        }

        $scope.changeGamedataVersion = function (version) {
            changeGamedataVersion(version);

        }
    }
})();