/**
 * IndexController
 * @namespace crowdjump.layout.controllers
 */
(function () {
        'use strict';

        angular
            .module('crowdjump.ideas.controllers')
            .controller('IdeasIndexController', IdeasIndexController);

        IdeasIndexController.$inject = ['$scope', 'Authentication', 'Ideas', 'History', 'Snackbar', '$cookies', 'ngDialog', '$controller', '$mdToast', '$window', '$route'];

        function IdeasIndexController($scope, Authentication, Ideas, History, Snackbar, $cookies, ngDialog, $controller, $mdToast, $window, $route) {
            var vm = this;
            var canDelete = true;

            $scope.search = {
                not_feasible: false,
                implemented: false
            };
            $scope.search.version = {};
            $scope.search.version.label = "";
            $scope.search.request_text = "";

            $scope.customFilter = function (idea) {
                alert(idea.manageable);
                if (idea.manageable && idea.manageable !== $scope.search.not_feasible) {
                    return idea;
                } else if (!idea.manageable && idea.manageable === $scope.search.not_feasible) {
                    return idea;
                }
            };

            $scope.isAuthenticated = Authentication.isAuthenticated();
            // console.error("ideas " + vm.isAuthenticated || false);
            $scope.ideas = [];
            $scope.versions = [];

            $scope.username2 = "asd";
            if ($scope.isAuthenticated) {
                $scope.cookie = $cookies.getObject('authenticatedAccount');
                $scope.username2 = $scope.cookie["username"]
            }
            ;


            activate();
            get_versions();

            vm.openDialog = function (idea_id) {
                var deleteUser = $window.confirm('Are you absolutely sure you want to delete this idea?');

                if (deleteUser) {
                    submit(idea_id);
                }
            }

            function submit(idea_id) {
                // alert("delete " + this.id);

                if (canDelete) {
                    Ideas.deleteIdea(idea_id).then(deleteSuccessFn, deleteErrorFn);
                    $route.reload();

                } else {
                    // alert("You can't delete your ideas at the moment, the next implementation is chosen soon!");
                    console.error("cant delete");
                    $route.reload();
                }

                // Snackbar.show("Post deleted");

                function deleteSuccessFn(data, status, headers, config) {
                    // Snackbar.show("Post deleted");
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("Post deleted")
                            .hideDelay(2000)
                    );
                    // $route.reload();
                }

                function deleteErrorFn(data, status, headers, config) {
                    // Snackbar.error(data.error);
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(data.error)
                            .hideDelay(2000)
                    );
                    console.error(data.error);

                }
            }


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
                console.log('Page changed to: ' + $scope.currentPage);
            };

            $scope.setItemsPerPage = function (num) {
                console.error(num);
                $scope.itemsPerPage = num;
                $scope.currentPage = 1; //reset to first page
            }

            $scope.versionFilter = function (label) {
                $scope.search.version.label = label;
            }


            $scope.clickManageable = function () {
                if ($scope.search.manageable == false) {
                    $scope.search.manageable == true;
                } else {
                    $scope.search.manageable == false;
                }
                alert($scope.search.manageable);
            }

            $scope.filterReset = function () {
                $scope.search = {};
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
                    $scope.totalItems = $scope.ideas.length;
                    $scope.currentPage = 1;
                    $scope.itemsPerPage = 5;
                    $scope.maxSize = 5; //Number of pager buttons to show
                    // console.error("data " + data.data);

                }

                function ideasErrorFn(data, status, headers, config) {
                    // Snackbar.error(data.error);
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(data.error)
                            .hideDelay(2000)
                    );
                    console.error(data.error);
                }
            }

            function get_versions() {
                History.all().then(historySuccessFn, historyErrorFn);

                function historySuccessFn(data, status, headers, config) {
                    $scope.versions = data.data;
                    $scope.newestVersion = $scope.versions[0];
                    // console.error("data " + data.data);
                    // console.error("v  " + $scope.newestVersion.label);

                }

                function historyErrorFn(data, status, headers, config) {
                    Snackbar.error(data.error);
                    console.error(data.error);
                }
            }

        }
    }

)();