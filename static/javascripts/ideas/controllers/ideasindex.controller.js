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
            $scope.filterReset = function () {
                $scope.search = {
                    not_feasible: false,
                    implemented: false,
                    request_text: "",
                    description: "",
                    user: {username: ""},
                    version: {label: "", id_min: 1, id_max: $scope.newestVersion.id}
                };
                this.versionFilterMin(1);
                this.versionFilterMax($scope.newestVersion.id);
            }

            $scope.search = {
                not_feasible: false,
                implemented: false,
                request_text: "",
                description: "",
                user: {username: ""},
                version: {label: "", id_min: 1, id_max: 999999}
            };

            $scope.customFilter = function (idea) {
                // console.error(idea.id + " idea f " + idea.feasible + "   search " + $scope.search.not_feasible + "  i "
                //     + idea.implemented + "  search " + $scope.search.implemented)

                if (idea.request_text.toLowerCase().match($scope.search.request_text.toLowerCase()) &&
                    idea.description.toLowerCase().match($scope.search.description.toLowerCase()) &&
                    idea.user.username.toLowerCase().match($scope.search.user.username.toLowerCase()) &&
                    idea.version.id >= $scope.search.version.id_min &&
                    idea.version.id <= $scope.search.version.id_max &&
                    idea.feasible != $scope.search.not_feasible &&
                    idea.implemented == $scope.search.implemented) {// || $scope.search.version.label == "all") {
                    return idea;

                    // if (idea.feasible && idea.feasible != $scope.search.not_feasible) {
                    //     console.error(idea.id + "feasible");
                    //     if (idea.implemented && idea.implemented == $scope.search.implemented) {
                    //         console.error(idea.id + "implemented");
                    //         return idea;
                    //     } else if (!idea.implemented && idea.implemented == $scope.search.implemented) {
                    //         console.error(idea.id + " not implemented");
                    //         return idea;
                    //     }
                    // } else if (!idea.feasible && idea.feasible == $scope.search.not_feasible) {
                    //     console.error(idea.id + " not feasible");
                    //     if (idea.implemented && idea.implemented == $scope.search.implemented) {
                    //         console.error(idea.id + "implemented");
                    //         return idea;
                    //     } else if (!idea.implemented && !idea.implemented == $scope.search.implemented) {
                    //         console.error(idea.id + "not implemented");
                    //         return idea;
                    //     }
                    // }
                }
            };

            $scope.isAuthenticated = Authentication.isAuthenticated();
            // console.error("ideas " + vm.isAuthenticated || false);
            $scope.ideas = [];
            $scope.versions = [];

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
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("You can't delete your ideas at the moment, the next implementation is chosen soon!")
                            .hideDelay(2000)
                    );
                    $route.reload();
                }

                // Snackbar.show("Post deleted");

                function deleteSuccessFn(data, status, headers, config) {
                    // Snackbar.show("Post deleted");
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("Idea deleted")
                            .hideDelay(2000)
                    );
                    // $route.reload();
                }

                function deleteErrorFn(data, status, headers, config) {
                    // Snackbar.error(data.error);
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent("There was an error, the idea has not been deleted!")
                            .hideDelay(2000)
                    );
                    // console.error(data.error);

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
                // console.log('Page changed to: ' + $scope.currentPage);
            };

            $scope.setItemsPerPage = function (num) {
                // console.error(num);
                $scope.itemsPerPage = num;
                $scope.currentPage = 1; //reset to first page
            }

            $scope.versionFilterMin = function (id) {
                $scope.search.version.id_min = id;
            }

            $scope.versionFilterMax = function (id) {
                $scope.search.version.id_max = id;
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
                    $scope.displayItems = $scope.ideas.slice(0, $scope.itemsPerPage);
                    // console.error("data " + data.data[0].description);

                }

                function ideasErrorFn(data, status, headers, config) {
                    // Snackbar.error(data.error);
                    $mdToast.show(
                        $mdToast.simple()
                            .textContent(data.error)
                            .hideDelay(2000)
                    );
                    // console.error(data.error);
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