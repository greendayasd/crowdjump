/**
 * IndexController
 * @namespace crowdjump.layout.controllers
 */
(function () {
        'use strict';

        angular
            .module('crowdjump.ideas.controllers')
            .controller('BugreportController', BugreportController);

        BugreportController.$inject = ['$scope', 'Authentication', 'Bugreports', 'History', 'ngDialog', '$controller', '$mdToast', '$window'];

        function BugreportController($scope, Authentication, Bugreports, History, ngDialog, $controller, $mdToast, $window) {
            var vm = this;
            var canDelete = true;
            var activate_comments = true;

            activate();
            //Filter/Ordering
            $scope.filterReset = function () {
                $scope.search = {
                    fixed: false,
                    request_text: "",
                    description: "",
                    user: {username: ""},
                    version: {label: "", id_min: 1, id_max: $scope.newestVersion.id}
                };
                this.versionFilterMin(1);
                this.versionFilterMax($scope.newestVersion.id);
            }


            $scope.search = {
                fixed: false,
                request_text: "",
                description: "",
                user: {username: ""},
                version: {label: "", id_min: 1, id_max: 999999}
            };

            $scope.customFilter = function (bugreport) {

                if (bugreport.request_text.toLowerCase().match($scope.search.request_text.toLowerCase()) &&
                    bugreport.description.toLowerCase().match($scope.search.description.toLowerCase()) &&
                    bugreport.user.username.toLowerCase().match($scope.search.user.username.toLowerCase()) &&
                    bugreport.version.id >= $scope.search.version.id_min &&
                    bugreport.version.id <= $scope.search.version.id_max &&
                    bugreport.fixed == $scope.search.fixed &&
                    bugreport.deleted == false) {// || $scope.search.version.label == "all") {
                    return bugreport;
                }
            };


            $scope.sortType = 'created_at';
            $scope.compareType = '';
            $scope.sortReverse = true;

            var sort_by = function (field, reverse, primer) {

                var key = primer ?
                    function (x) {
                        return primer(x[field])
                    } :
                    function (x) {
                        return x[field]
                    };

                reverse = !reverse ? 1 : -1;

                return function (a, b) {
                    return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
                }
            }

            $scope.sort_all = function () {
                $scope.bugreports.sort(sort_by($scope.sortType, $scope.sortReverse, $scope.compareType))
            };

            $scope.orderOldest = function () {
                $scope.sortType = 'created_at';
                $scope.compareType = '';
                $scope.sortReverse = false;
                $scope.sort_all()
            };

            $scope.orderNewest = function () {
                $scope.sortType = 'created_at';
                $scope.compareType = '';
                $scope.sortReverse = true;
                $scope.sort_all()
            };

            $scope.sort_new = function () {
                $scope.sortType = 'id';
                $scope.compareType = parseInt;
                $scope.sort_all()
            };

            $scope.isAuthenticated = Authentication.isAuthenticated();
            $scope.bugreports = [];
            $scope.versions = [];

            if ($scope.isAuthenticated) {
                $scope.cookie = Authentication.getAuthenticatedAccount();
                $scope.userid = $scope.cookie["id"];
                $scope.username2 = $scope.cookie["username"];
                // console.log($scope.userid + ' ' + $scope.username2);
            }



            //Pagination
            $scope.selector = {};
            $scope.selector.configs = [
                {
                    'name': 3,
                    'value': 3
                },
                {
                    'name': 5,
                    'value': 5
                },
                {
                    'name': 10,
                    'value': 10
                },
                {
                    'name': 20,
                    'value': 20
                }
            ];

            $scope.selector.config = $scope.selector.configs[1];

            $scope.setPage = function (pageNo) {
                $scope.currentPage = pageNo;
            };

            $scope.pageChanged = function () {
                // console.log('Page changed to: ' + $scope.currentPage);
            };

            $scope.setItemsPerPage = function (num) {
                // console.error(num);
                $scope.itemsPerPage = num;
                $scope.currentPage = 1; //reset to first page
            }

            // $scope.setItemsPerPage(5);
            $scope.versionFilterMin = function (id) {
                $scope.search.version.id_min = id;
            }

            $scope.versionFilterMax = function (id) {
                $scope.search.version.id_max = id;
            }


            function activate() {
                Bugreports.all().then(bugreportsSuccessFn, bugreportsErrorFn);

                $scope.$on('bugreport.created', function (event, bugreport) {
                    $scope.bugreports.unshift(bugreport);
                });

                $scope.$on('bugreport.created.error', function () {
                    $scope.bugreports.shift();
                });

                function bugreportsSuccessFn(data, status, headers, config) {
                    get_versions();
                    $scope.bugreports = data.data;

                    $scope.totalItems = $scope.bugreports.length;
                    $scope.currentPage = 1;
                    $scope.itemsPerPage = 5;
                    $scope.maxSize = 5; //Number of pager buttons to show
                    $scope.displayItems = $scope.bugreports.slice(0, $scope.itemsPerPage);
                }

                function bugreportsErrorFn(data, status, headers, config) {
                    var msg = "Could not get bug reports";
                    toast(msg);
                }
            }

            function get_versions() {
                History.all().then(historySuccessFn, historyErrorFn);

                function historySuccessFn(data, status, headers, config) {
                    $scope.versions = data.data;
                    $scope.versions_max = data.data;
                    // $scope.versions.unshift({id: -1, label: "all"});
                    $scope.newestVersion = $scope.versions[0];
                    $scope.oldestVersion = $scope.versions_max[$scope.versions_max.length - 1]
                }

                function historyErrorFn(data, status, headers, config) {
                    console.error(data.error);
                }
            }

            function submitDeleteBugreport(bugreport_id) {
                if (canDelete) {
                    Bugreports.deleteBugreport(bugreport_id).then(deleteSuccessFn, deleteErrorFn);

                } else {
                    var msg = "You can't delete your bugreports at the moment, the next implementation is chosen soon!";
                    toast(msg);
                }


                function deleteSuccessFn(data, status, headers, config) {
                    var msg = "Bugreport deleted";

                    toast(msg);
                    var index = get_BugreportIndex(bugreport_id);
                    $scope.bugreports.splice(index, 1);
                    $scope.sort_all();
                    // $scope.$apply();
                }

                function deleteErrorFn(data, status, headers, config) {
                    msg = "There was an error, the bug report has not been deleted!";
                    toast(msg);
                    // console.error(data.error);

                }
            }

            vm.openDialogDeleteBugreport = function (bugreport_id) {
                var deleteUser = $window.confirm('Are you absolutely sure you want to delete this bug report?');

                if (deleteUser) {
                    submitDeleteBugreport(bugreport_id);
                }
            }


            var ws_scheme = 'wss'; //window.location.protocol == "https:" ? "wss" : "ws";
            var port = ':8001';
            if (window.location.host == "localhost:8000") {
                ws_scheme = 'ws';
                port = '';
            }
            //Websocket
            var bugreportSocket = new WebSocket(
                ws_scheme + '://' + window.location.host + port +
                '/ws/bugreports/');

            bugreportSocket.onmessage = function (e) {
                var data = JSON.parse(e.data);
                // console.log("type " + data["type"]);
                if (data["type"] == 'bugreport_broadcast') {
                    receive_bugreport(data);
                }
            };


            function receive_bugreport(data) {
                // console.log(data);
                var msg = "A new bug report was published!";
                $scope.bugreports.push(data);
                $scope.sort_all();
                $scope.$apply();
                toast(msg);

            }

            //utility
            function get_BugreportIndex(bugreport_id) {
                for (var i = $scope.bugreports.length - 1; i >= 0; i--) {
                    if ($scope.bugreports[i].id == bugreport_id) {
                        return i;
                    }
                }
            }


            //table functions

            $scope.tableRowExpanded = false;
            $scope.tableRowIndexExpandedCurr = "";
            $scope.tableRowIndexExpandedPrev = "";

            $scope.selectTableRow = function (index) {
                if (typeof $scope.bugreportCollapse === 'undefined') {
                    $scope.bugreportCollapseFn();
                }

                if ($scope.tableRowExpanded === false && $scope.tableRowIndexExpandedCurr === "") {
                    $scope.tableRowIndexExpandedPrev = "";
                    $scope.tableRowExpanded = true;
                    $scope.tableRowIndexExpandedCurr = index;
                    $scope.bugreportCollapse[index] = true;
                } else if ($scope.tableRowExpanded === true) {
                    if ($scope.tableRowIndexExpandedCurr === index) {
                        $scope.tableRowExpanded = false;
                        $scope.tableRowIndexExpandedCurr = "";
                        $scope.bugreportCollapse[index] = false;
                    } else {
                        $scope.tableRowIndexExpandedPrev = $scope.tableRowIndexExpandedCurr;
                        $scope.tableRowIndexExpandedCurr = index;
                        $scope.bugreportCollapse[$scope.tableRowIndexExpandedPrev] = false;
                        $scope.bugreportCollapse[$scope.tableRowIndexExpandedCurr] = true;
                    }
                }

            };

            $scope.test = function () {
                document.getElementById('pagination').scrollIntoView();
            }

            function sort_date_chosen(a,b){
                if (a.date_chosen < b.date_chosen) return -1
                if (a.date_chosen > b.date_chosen) return 1
                return 0;

            }
            function toast(msg) {
                var toast = $mdToast.simple().textContent(msg)
                    .parent($("#toast-container"));
                $mdToast.show(toast);
            }
        }
    }

)();