/**
 * IndexController
 * @namespace crowdjump.layout.controllers
 */
(function () {
    'use strict';

    angular
        .module('crowdjump.history.controllers')
        .controller('HistoryIndexController', HistoryIndexController);

    HistoryIndexController.$inject = ['$scope', 'Authentication', 'History', 'Snackbar', '$cookies'];

    function HistoryIndexController($scope, Authentication, History, Snackbar, $cookies) {
        var vm = this;

        $scope.history = [];
        $scope.tableRowExpanded = false;
        $scope.tableRowIndexExpandedCurr = "";
        $scope.tableRowIndexExpandedPrev = "";


        activate();

        $scope.selectTableRow = function (index) {
            if (typeof $scope.historyCollapse === 'undefined') {
                $scope.historyCollapseFn();
            }

            if ($scope.tableRowExpanded === false && $scope.tableRowIndexExpandedCurr === "") {
                $scope.tableRowIndexExpandedPrev = "";
                $scope.tableRowExpanded = true;
                $scope.tableRowIndexExpandedCurr = index;
                $scope.historyCollapse[index] = true;
            } else if ($scope.tableRowExpanded === true) {
                if ($scope.tableRowIndexExpandedCurr === index) {
                    $scope.tableRowExpanded = false;
                    $scope.tableRowIndexExpandedCurr = "";
                    $scope.historyCollapse[index] = false;
                } else {
                    $scope.tableRowIndexExpandedPrev = $scope.tableRowIndexExpandedCurr;
                    $scope.tableRowIndexExpandedCurr = index;
                    $scope.historyCollapse[$scope.tableRowIndexExpandedPrev] = false;
                    $scope.historyCollapse[$scope.tableRowIndexExpandedCurr] = true;
                }
            }

        };

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
            History.all().then(historySuccessFn, historyErrorFn);

            $scope.$on('history.created', function (event, history) {
                $scope.history.unshift(history);
            });

            $scope.$on('history.created.error', function () {
                $scope.history.shift();
            });

            function historySuccessFn(data, status, headers, config) {
                $scope.history = data.data;
                $scope.viewby = 20;
                $scope.totalItems = $scope.history.length;
                $scope.currentPage = 1;
                $scope.itemsPerPage = $scope.viewby;
                $scope.maxSize = 5; //Number of pager buttons to show
                // console.error("data " + data.data);

                $scope.historyCollapseFn = function () {
                    $scope.historyCollapse = [];
                    for (var i = 0; i < $scope.history.length; i += 1) {
                        $scope.historyCollapse.push(false);
                    }
                };

            }

            function historyErrorFn(data, status, headers, config) {
                Snackbar.error(data.error);
                console.error(data.error);
            }
        }
    }
})();