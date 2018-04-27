/**
 * IndexController
 * @namespace crowdjump.layout.controllers
 */
(function () {
        'use strict';

        angular
            .module('crowdjump.ideas.controllers')
            .controller('IdeasIndexController', IdeasIndexController);

        IdeasIndexController.$inject = ['$scope', 'Authentication', 'Ideas', 'Comments', 'Votes', 'History', 'Snackbar', '$cookies', 'ngDialog', '$controller', '$mdToast', '$window', '$route'];

        function IdeasIndexController($scope, Authentication, Ideas, Comments, Votes, History, Snackbar, $cookies, ngDialog, $controller, $mdToast, $window, $route) {
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
                    idea.implemented == $scope.search.implemented &&
                    idea.deleted == false) {// || $scope.search.version.label == "all") {
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
                $scope.userid = $scope.cookie["id"];
                // console.error($scope.userid);
                $scope.username2 = $scope.cookie["username"];
            }

            get_ideavotes();

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


            function get_ideavotes() {
                Votes.all_user($scope.userid).then(ideavotesSuccessFn, ideavotesErrorFn);


                function ideavotesSuccessFn(data, status, headers, config) {
                    $scope.ideavotes = data.data;
                    // console.error("data " + data.data[0].description);

                }

                function ideavotesErrorFn(data, status, headers, config) {
                    // Snackbar.error(data.error);
                    // $mdToast.show(
                    //     $mdToast.simple()
                    //         .textContent(data.error)
                    //         .hideDelay(2000)
                    // );
                    // console.error(data.error);
                }
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
                    $scope.ideas_tmp = data.data;

                    $scope.ideas = $.map($scope.ideas_tmp, function (idea) {
                        var vote = $.grep($scope.ideavotes, function (ideavote) {
                            return ideavote.idea === idea.id;
                        })[0];
                        if (typeof vote !== 'undefined') {
                            // console.log(vote);

                            idea.uservote = vote.vote;

                        } else {
                            // console.log("0!");
                            idea.uservote = 0;
                        }
                        return idea;
                    });

                    $scope.totalItems = $scope.ideas.length;
                    $scope.currentPage = 1;
                    $scope.itemsPerPage = 5;
                    $scope.maxSize = 5; //Number of pager buttons to show
                    $scope.displayItems = $scope.ideas.slice(0, $scope.itemsPerPage);
                    // console.error("data " + data.data[0].description);

                    // console.log($.map($scope.ideavotes, function (ideavote) {
                    //     var idea = $.grep($scope.ideas, function (idea) {
                    //         return ideavote.idea === idea.id;
                    //     })[0];
                    //
                    //     return ideavote;
                    // }));

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

                    if ($scope.isAuthenticated) {
                        $scope.vote_weight = $scope.cookie["vote_weight"];
                        $scope.multiplier = $scope.cookie["vote_multiplier"];
                        $scope.vote = Math.abs(($scope.newestVersion.vote_weight - $scope.vote_weight + 1) * $scope.multiplier);
                        $scope.text_vote_weight = "Calculated from your playing time, one of your votes is worth " + $scope.vote + " points. Play more to increase this amount!"
                    }

                }

                function historyErrorFn(data, status, headers, config) {
                    Snackbar.error(data.error);
                    console.error(data.error);
                }
            }

            $scope.test = function () {
                Votes.test();
            }


            //Voting
            $scope.upvote = function (idea_id, upvotes, downvotes) {
                var upvote_img = document.getElementById('upvote_button' + idea_id);
                var downvote_img = document.getElementById('downvote_button' + idea_id);

                var upvote_count = document.getElementById('upvote_count' + idea_id);
                var downvote_count = document.getElementById('downvote_count' + idea_id);


                if (downvote_img.src.match("/static/website/images/downvote%20trans.png")) {
                    downvote_img.src = "/static/website/images/downvote%20trans%20dark.png";
                    upvote_img.src = "/static/website/images/upvote%20trans%20bright.png";
                    Votes.down_to_up(idea_id, $scope.userid, upvotes, downvotes, $scope.vote, $scope.multiplier);
                    downvote_count.textContent = upvotes - $scope.vote;
                    upvote_count.textContent = upvotes + $scope.vote;
                }

                if (upvote_img.src.match("/static/website/images/upvote%20trans.png")) {
                    upvote_img.src = "/static/website/images/upvote%20trans%20bright.png";
                    // console.error("upvotes? " + upvotes);
                    Votes.upvote(idea_id, $scope.userid, upvotes, downvotes, $scope.vote, $scope.multiplier);
                    upvote_count.textContent = upvotes + $scope.vote;

                } else {
                    Votes.undo_upvote(idea_id, $scope.userid, upvotes, downvotes, $scope.vote, $scope.multiplier);
                    upvote_img.src = "/static/website/images/upvote%20trans.png";
                    upvote_count.textContent = upvotes - $scope.vote;
                }
            }


            $scope.downvote = function (idea_id, upvotes, downvotes) {
                var upvote_img = document.getElementById('upvote_button' + idea_id);
                var downvote_img = document.getElementById('downvote_button' + idea_id);

                var upvote_count = document.getElementById('upvote_count' + idea_id);
                var downvote_count = document.getElementById('downvote_count' + idea_id);


                if (upvote_img.src.match("/static/website/images/upvote%20trans%20bright.png")) {
                    upvote_img.src = "/static/website/images/upvote%20trans.png";
                    downvote_img.src = "/static/website/images/downvote%20trans.png";
                    Votes.up_to_down(idea_id, $scope.userid, upvotes, downvotes, $scope.vote, $scope.multiplier);
                    downvote_count.textContent = downvotes + $scope.vote;
                    upvote_count.textContent = upvotes + $scope.vote;
                }


                if (downvote_img.src.match("/static/website/images/downvote%20trans%20dark.png")) {
                    downvote_img.src = "/static/website/images/downvote%20trans.png";
                    Votes.downvote(idea_id, $scope.userid, upvotes, downvotes, $scope.vote, $scope.multiplier);
                    downvote_count.textContent = downvotes + $scope.vote;
                } else {
                    downvote_img.src = "/static/website/images/downvote%20trans%20dark.png";
                    Votes.undo_downvote(idea_id, $scope.userid, upvotes, downvotes, $scope.vote, $scope.multiplier);
                    downvote_count.textContent = downvotes - $scope.vote;

                }
            }
        }
    }

)();