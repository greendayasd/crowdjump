(function () {
    'use strict';

    angular
        .module('crowdjump.history.controllers')
        .controller('HistoryIndexController', HistoryIndexController);

    HistoryIndexController.$inject = ['$scope', 'Authentication', 'History', 'Ideas'];

    function HistoryIndexController($scope, Authentication, History, Ideas) {

        $scope.history = [];
        $scope.ideas = [];
        $scope.tableRowExpanded = false;
        $scope.tableRowIndexExpandedCurr = "";
        $scope.tableRowIndexExpandedPrev = "";

        getIdeas();

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
            // console.log('Page changed to: ' + $scope.currentPage);
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
                $scope.history_tmp = data.data;
                for (var i = $scope.history_tmp.length-1 ; i >=0; i--) {
                    log($scope.history_tmp[i].id, versionnumber);
                        if ($scope.history_tmp[i].id <=versionnumber) {
                            $scope.history.push($scope.history_tmp[i]);
                            log($scope.history);
                        }
                    }

                //$scope.history.splice(1,1);
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

                setIdeas();
            }

            function historyErrorFn(data, status, headers, config) {
                console.error(data.error);
            }
        }


        function getIdeas() {
            Ideas.all_implemented().then(ideasSuccessFn, ideasErrorFn);

            function ideasSuccessFn(data, status, headers, config) {
                $scope.ideas = data.data;
                activate();
            }

            function ideasErrorFn(data, status, headers, config) {
                // console.error(data.error);
            }
        }

        function setIdeas() {
            for (var i = $scope.history.length - 1; i >= 0; i--) {
                var index = get_IdeaIndex($scope.history[i].idea_nr);
                $scope.history[i].idea = $scope.ideas[index];
            }
        }

        //utility
        function get_IdeaIndex(idea_id) {
            for (var i = $scope.ideas.length - 1; i >= 0; i--) {
                if ($scope.ideas[i].id == idea_id) {
                    return i;
                }
            }
        }
    }
})();