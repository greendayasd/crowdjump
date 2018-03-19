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

        $scope.isAuthenticated = Authentication.isAuthenticated();
        // console.error("ideas " + vm.isAuthenticated || false);
        $scope.ideas = [];

        $scope.username2 = "asd";
        if ($scope.isAuthenticated) {
            $scope.cookie = $cookies.getObject('authenticatedAccount');
            $scope.username2 = $scope.cookie["username"]
        }
        ;

        activate();


        $scope.setPage = function (pageNo) {
            $scope.currentPage = pageNo;
        };

        $scope.pageChanged = function () {
            console.log('Page changed to: ' + $scope.currentPage);
        };

        $scope.setItemsPerPage = function (num) {
            $scope.itemsPerPage = num;
            $scope.currentPage = 1; //reset to first page
        }

        function activate() {
            Ideas.all().then(ideasSuccessFn, ideasErrorFn);

            $scope.$on('idea.created', function (event, idea) {
                $scope.ideas.unshift(idea);
            });

            $scope.$on('idea.created.error', function () {
                $scope.ideas.shift();
            });

            function ideasSuccessFn(data, status, headers, config) {
                $scope.ideas = data.data;
                $scope.viewby = 3;
                $scope.totalItems = $scope.ideas.length;
                $scope.currentPage = 1;
                $scope.itemsPerPage = $scope.viewby;
                $scope.maxSize = 5; //Number of pager buttons to show
                // console.error("data " + data.data);

                $scope.setItemsPerPage(5);
            }

            function ideasErrorFn(data, status, headers, config) {
                Snackbar.error(data.error);
                console.error(data.error);
            }
        }

    }
})();