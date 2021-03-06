/**
 * IndexController
 * @namespace crowdjump.layout.controllers
 */
(function () {
        'use strict';

        angular
            .module('crowdjump.ideas.controllers')
            .controller('IdeasIndexController', IdeasIndexController);

        IdeasIndexController.$inject = ['$scope', 'Authentication', 'Ideas', 'Comments', 'Votes', 'History', 'ngDialog', '$controller', '$mdToast', '$window'];

        function IdeasIndexController($scope, Authentication, Ideas, Comments, Votes, History, ngDialog, $controller, $mdToast, $window) {
            var vm = this;
            var canDelete = true;
            var activate_comments = true;
            var last_idea_id = 34;
            var last_idea_id2 = 41;
            $scope.currently_implementing = [];

            get_ideavotes();
            get_Comments();

            //Filter/Ordering
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

                if (idea.request_text.toLowerCase().match($scope.search.request_text.toLowerCase()) &&
                    idea.description.toLowerCase().match($scope.search.description.toLowerCase()) &&
                    idea.user.username.toLowerCase().match($scope.search.user.username.toLowerCase()) &&
                    idea.version.id >= $scope.search.version.id_min &&
                    idea.version.id <= $scope.search.version.id_max &&
                    idea.feasible != $scope.search.not_feasible &&
                    idea.implemented == $scope.search.implemented &&
                    idea.deleted == false) {// || $scope.search.version.label == "all") {
                    return idea;
                }
            };

            $scope.customCommentFilter = function (comment) {
                // console.error(idea.id + " idea f " + idea.feasible + "   search " + $scope.search.not_feasible + "  i "
                //     + idea.implemented + "  search " + $scope.search.implemented)
                var index = get_IdeaIndex(comment.idea);
                var show_comments = false;
                if (typeof $scope.ideas[index] == 'undefined') {
                    return;
                }
                if (typeof $scope.ideas[index].show_comments != 'undefined') {
                    if ($scope.ideas[index].show_comments) {
                        show_comments = true;
                    }
                }

                if (show_comments) {
                    if (comment.idea == 43) {
                        // console.log("alle" + JSON.stringify(comment) + '  ' + show_comments);
                    }
                    return comment;
                }

                var length = $scope.ideas[index].comments.length;
                if (get_CommentIndex(index, comment.id) == 0) {
                    if (comment.idea == 43) {
                        // console.log("einzeln" + JSON.stringify(comment) + '  ' + show_comments);
                    }
                    return comment;
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
                // console.log($scope.sortType + '    ' + $scope.sortReverse);
                if ($scope.sortType == 'upvotes' || $scope.sortType == 'downvotes') {
                    $scope.ideas.sort(sort_by($scope.sortType, !$scope.sortReverse, $scope.compareType))
                } else {
                    $scope.ideas.sort(sort_by($scope.sortType, $scope.sortReverse, $scope.compareType))
                }
            }


            $scope.orderUpvotes = function () {
                $scope.sortType = 'upvotes';
                $scope.compareType = parseInt;
                $scope.sortReverse = false;
                $scope.sort_all()
            }

            $scope.orderDownvotes = function () {
                $scope.sortType = 'downvotes';
                $scope.compareType = parseInt;
                $scope.sortReverse = false;
                $scope.sort_all()
            }

            $scope.orderOldest = function () {
                $scope.sortType = 'created_at';
                $scope.compareType = '';
                $scope.sortReverse = false;
                $scope.sort_all()
            }

            $scope.orderNewest = function () {
                $scope.sortType = 'created_at';
                $scope.compareType = '';
                $scope.sortReverse = true;
                $scope.sort_all()
            }

            $scope.sort_new = function () {
                $scope.sortType = 'id';
                $scope.compareType = parseInt;
                $scope.sort_all()
            }

            $scope.isAuthenticated = Authentication.isAuthenticated();
            $scope.showVotes = true;
            $scope.ideas = [];
            $scope.versions = [];
            $scope.comments = [];

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

            function get_ideavotes() {
                Votes.all_user($scope.userid).then(ideavotesSuccessFn, ideavotesErrorFn);

                function ideavotesSuccessFn(data, status, headers, config) {
                    $scope.ideavotes = data.data;
                }

                function ideavotesErrorFn(data, status, headers, config) {
                }
            }

            function get_Comments() {
                Comments.all().then(commentsSuccessFn, commentsErrorFn);

                function commentsSuccessFn(data, status, headers, config) {
                    $scope.comments = data.data;

                    activate();
                    get_versions();
                }

                function commentsErrorFn(data, status, headers, config) {
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

                    //filter currently implemented ideas
                    for (var i = $scope.ideas_tmp.length - 1; i >= 0; i--) {
                        if ($scope.ideas_tmp[i].currently_implemented == 1) {
                            $scope.currently_implementing.push($scope.ideas_tmp[i]);
                            $scope.ideas_tmp.splice(i, 1);
                        }
                    }
                    $scope.currently_implementing.sort(sort_date_chosen);
                    //Table for ideas
                    $scope.ideaCollapseFn = function () {
                        $scope.ideaCollapse = [];
                        for (var i = 0; i < $scope.currently_implementing.length; i += 1) {
                            $scope.ideaCollapse.push(false);
                        }
                    };

                    //find own votes for ideas
                    $scope.ideas = $scope.ideas_tmp;
                    $scope.last_idea = $scope.ideas[get_IdeaIndex(last_idea_id)];
                    $scope.last_idea2 = $scope.ideas[get_IdeaIndex(last_idea_id2)];
                    $scope.ideas = $.map($scope.ideas_tmp, function (idea) {
                        var vote = $.grep($scope.ideavotes, function (ideavote) {
                            return ideavote.idea === idea.id;
                        })[0];
                        if (typeof vote !== 'undefined') {

                            idea.uservote = vote.vote;

                        } else {
                            idea.uservote = 0;
                        }


                        if (activate_comments) {
                            var comments = $.grep($scope.comments, function (comment) {
                                return comment.idea === idea.id;
                            });
                            if (typeof comments !== 'undefined') {
                                // console.log(vote);
                                idea.show_comments = false;
                                idea.comments = comments;
                                idea.newest_comment = comments[0];
                                if (typeof idea.newest_comment !== 'undefined') {
                                    // console.error(idea.newest_comment["user"]["username"]);
                                    idea.newest_comment_user = idea.newest_comment["user"]["username"];

                                }

                            } else {
                                idea.comments = {'id': -1};
                                idea.newest_comment = {'id': -1};
                            }
                        }


                        return idea;
                    });

                    $scope.totalItems = $scope.ideas.length;
                    $scope.currentPage = 1;
                    $scope.itemsPerPage = 5;
                    $scope.maxSize = 5; //Number of pager buttons to show
                    $scope.displayItems = $scope.ideas.slice(0, $scope.itemsPerPage);


                }

                function ideasErrorFn(data, status, headers, config) {
                    var msg = "Could not get ideas";
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

                    if ($scope.isAuthenticated) {
                        $scope.vote_weight = $scope.cookie["vote_weight"];
                        $scope.multiplier = $scope.cookie["vote_multiplier"];

                        // multiplier per version:
                        // <15 games played: 0,3
                        // >20 games played, >5 games won: 0,5
                        // >25 games played, >10 games won: 0,7
                        // >30 games played, >15 games won: 1
                        // final multiplier: (sum(multiplier)+ 2*multiplier last version) / (versions played + 2)
                        $scope.vote = Math.abs(($scope.newestVersion.vote_weight - $scope.vote_weight) * $scope.multiplier) + 1;
                        var plural = '';
                        if ($scope.vote > 1) {
                            plural = 's';
                        }
                        $scope.text_vote_weight = "Calculated from your playing time, one of your votes is worth " + $scope.vote + " point" + plural + ". Play more to increase this amount when the next version is live!"
                    }

                }

                function historyErrorFn(data, status, headers, config) {
                    console.error(data.error);
                }
            }

            function submitDeleteIdea(idea_id) {
                // alert("delete " + this.id);

                if (canDelete) {
                    Ideas.deleteIdea(idea_id).then(deleteSuccessFn, deleteErrorFn);


                } else {
                    var msg = "You can't delete your ideas at the moment, the next implementation is chosen soon!";
                    toast(msg);
                }


                function deleteSuccessFn(data, status, headers, config) {
                    var msg = "Idea deleted";

                    toast(msg);
                    var index = get_IdeaIndex(idea_id);
                    $scope.ideas.splice(index, 1);
                    $scope.sort_all();
                    // $scope.$apply();
                }

                function deleteErrorFn(data, status, headers, config) {
                    msg = "There was an error, the idea has not been deleted!";
                    toast(msg);
                    // console.error(data.error);

                }
            }

            //Voting
            $scope.upvote = function (idea_id) {
                var index = get_IdeaIndex(idea_id);
                var upvote_img = document.getElementById('upvote_button' + idea_id);
                var downvote_img = document.getElementById('downvote_button' + idea_id);
                // var upvote_count = document.getElementById('upvote_count' + idea_id);
                // var downvote_count = document.getElementById('downvote_count' + idea_id);

                var upvotes = $scope.ideas[index].upvotes + 0;
                var downvotes = $scope.ideas[index].downvotes + 0;

                if (downvote_img.src.match("/static/website/images/downvote%20trans.png")) {
                    //down to up
                    downvote_img.src = "/static/website/images/downvote%20trans%20dark.png";
                    upvote_img.src = "/static/website/images/upvote%20trans%20bright.png";

                    $.when(Votes.vote(idea_id, $scope.userid, $scope.vote)).then(function (Voteresult, status, etc) {
                        upvotes = Voteresult["upvotes"];
                        downvotes = Voteresult["downvotes"];
                    });
                    downvotes = downvotes - $scope.vote;
                    upvotes = upvotes + $scope.vote;
                }

                else if (upvote_img.src.match("/static/website/images/upvote%20trans.png")) {
                    //Upvote
                    upvote_img.src = "/static/website/images/upvote%20trans%20bright.png";
                    $.when(Votes.vote(idea_id, $scope.userid, $scope.vote)).then(function (Voteresult, status, etc) {
                        upvotes = Voteresult["upvotes"];
                        downvotes = Voteresult["downvotes"];
                    });
                    upvotes = upvotes + $scope.vote;

                } else {
                    //undo Upvote
                    $.when(Votes.vote(idea_id, $scope.userid, 0)).then(function (Voteresult, status, etc) {
                        upvotes = Voteresult["upvotes"];
                        downvotes = Voteresult["downvotes"];
                    });
                    upvote_img.src = "/static/website/images/upvote%20trans.png";
                    upvotes = upvotes - $scope.vote;
                }
                // console.log(upvotes + " , " + downvotes);
                var content = {};
                content["idea_id"] = idea_id;
                content["upvotes"] = upvotes;
                content["downvotes"] = downvotes;
                content["type"] = "vote_broadcast";
                broadcast_vote(content);
                $scope.ideas[index].upvotes = upvotes;
                $scope.ideas[index].downvotes = downvotes;
                // upvote_count.textContent = upvotes;
                // downvote_count.textContent = downvotes;
                // $scope.$apply();
            }

            $scope.downvote = function (idea_id) {
                var index = get_IdeaIndex(idea_id);
                var upvote_img = document.getElementById('upvote_button' + idea_id);
                var downvote_img = document.getElementById('downvote_button' + idea_id);

                // var upvote_count = document.getElementById('upvote_count' + idea_id);
                // var downvote_count = document.getElementById('downvote_count' + idea_id);
                var upvotes = $scope.ideas[index].upvotes + 0;
                var downvotes = $scope.ideas[index].downvotes + 0;
                var Voteresult = [];


                if (upvote_img.src.match("/static/website/images/upvote%20trans%20bright.png")) {
                    //up to down
                    upvote_img.src = "/static/website/images/upvote%20trans.png";
                    downvote_img.src = "/static/website/images/downvote%20trans.png";
                    $.when(Votes.vote(idea_id, $scope.userid, -$scope.vote)).then(function (Voteresult, status, etc) {
                        upvotes = Voteresult["upvotes"];
                        downvotes = Voteresult["downvotes"];
                    });
                    downvotes = downvotes + $scope.vote;
                    upvotes = upvotes - $scope.vote;
                }


                else if (downvote_img.src.match("/static/website/images/downvote%20trans%20dark.png")) {
                    //downvote
                    downvote_img.src = "/static/website/images/downvote%20trans.png";
                    $.when(Votes.vote(idea_id, $scope.userid, -$scope.vote)).then(function (Voteresult, status, etc) {
                        upvotes = Voteresult["upvotes"];
                        downvotes = Voteresult["downvotes"];
                    });
                    downvotes = downvotes + $scope.vote;
                } else {
                    //undo downvote
                    downvote_img.src = "/static/website/images/downvote%20trans%20dark.png";
                    $.when(Votes.vote(idea_id, $scope.userid, 0)).then(function (Voteresult, status, etc) {
                        upvotes = Voteresult["upvotes"];
                        downvotes = Voteresult["downvotes"];
                    });
                    downvotes = downvotes - $scope.vote;

                }

                var content = {};
                content["idea_id"] = idea_id;
                content["upvotes"] = upvotes;
                content["downvotes"] = downvotes;
                content["type"] = "vote_broadcast";
                broadcast_vote(content);
                // console.log("downvote " + upvotes + " , " + downvotes);
                $scope.ideas[index].upvotes = upvotes;
                $scope.ideas[index].downvotes = downvotes;
                // upvote_count.textContent = upvotes;
                // downvote_count.textContent = downvotes;
            }

            $scope.vote_impossible = function () {

                var msg = "You can't vote for this idea anymore!";
                toast(msg);

            }

            $scope.vote_login_needed = function () {

                var msg = "Login to vote for this idea!";
                toast(msg);

            }
            //Comments
            // $scope.comment_text = '';
            $scope.addNewComment = function (idea_id) {
                var comment_text_field = document.getElementById('comment_text' + idea_id);
                var comment_text = comment_text_field.value;
                var content = {
                    'idea': "" + idea_id + "",
                    'text': "" + comment_text + ""
                }
                // console.log(content);
                Comments.create(content).then(createCommentSuccessFn, createCommentErrorFn);

                function createCommentSuccessFn(data, status, headers, config) {

                    var content = data["data"];
                    content["type"] = 'comment_broadcast';
                    broadcast_comment(content);
                    comment_text_field.value = '';
                }

                function createCommentErrorFn(data, status, headers, config) {
                    $scope.$broadcast('idea.created.error');

                    var msg = "There was an error, the comment was not posted!";
                    toast(msg);
                }

            }

            vm.openDialogDeleteIdea = function (idea_id) {
                var deleteUser = $window.confirm('Are you absolutely sure you want to delete this idea?');

                if (deleteUser) {
                    submitDeleteIdea(idea_id);
                }
            }

            vm.openDialogDeleteComment = function (idea_id, comment_id) {
                var deleteUser = $window.confirm('Are you absolutely sure you want to delete this comment?');

                if (deleteUser) {
                    submitDeleteComment(idea_id, comment_id);
                }
            }

            function submitDeleteComment(idea_id, comment_id) {
                // alert("delete " + this.id);
                // console.log(comment_id);
                if (canDelete) {
                    Comments.deleteComment(comment_id).then(deleteSuccessFn, deleteErrorFn);

                } else {
                    var msg = "You can't delete your comments at the moment, the next implementation is chosen soon!";
                    toast(msg);
                }


                function deleteSuccessFn(data, status, headers, config) {
                    var msg = "Comment deleted";
                    toast(msg);

                    var idea_index = get_IdeaIndex(idea_id);
                    var index = get_CommentIndex(idea_index, comment_id);
                    $scope.ideas[idea_index].comments.splice(index, 1);
                    $scope.sort_all();
                }

                function deleteErrorFn(data, status, headers, config) {
                    msg = "There was an error, the comment has not been deleted!";

                    toast(msg);

                }
            }

            var ws_scheme = 'wss'; //window.location.protocol == "https:" ? "wss" : "ws";
            var port = ':8001';
            if (window.location.host == "localhost:8000") {
                ws_scheme = 'ws';
                port = '';
            }
            //Websocket
            var ideaSocket = new WebSocket(
                ws_scheme + '://' + window.location.host + port +
                '/ws/ideas/');

            var voteSocket = new WebSocket(
                ws_scheme + '://' + window.location.host + port +
                '/ws/votes/');


            ideaSocket.onmessage = function (e) {
                var data = JSON.parse(e.data);
                // console.log("type " + data["type"]);
                if (data["type"] == 'idea_broadcast') {
                    receive_idea(data);
                }
                if (data["type"] == 'comment_broadcast') {
                    receive_comment(data);
                }
            };

            voteSocket.onmessage = function (e) {
                var data = JSON.parse(e.data);
                // console.log("type " + data["type"]);
                if (data["type"] == 'vote_broadcast') {
                    receive_vote(data);
                }
            };


            //can't delete, User could be already commenting the idea
            function broadcast_delete(message) {

                // ideaSocket.onclose = function (e) {
                //     console.error('Chat socket closed unexpectedly');
                // };

                // console.log('deleted')
            }

            function broadcast_comment(content) {

                try {
                    ideaSocket.onclose = function (e) {
                        console.error('Chat socket closed unexpectedly ' + e);
                    };

                    ideaSocket.send(JSON.stringify(content));
                }
                catch (err) {
                    console.log(err.message);
                }

            }

            function broadcast_vote(content) {

                try {
                    voteSocket.onclose = function (e) {
                        console.error('Chat socket closed unexpectedly ' + e);
                    };

                    voteSocket.send(JSON.stringify(content));
                }
                catch (err) {
                    console.log(err.message);
                }

            }

            function receive_idea(data) {
                // console.log(data);
                var msg = "A new idea was published!";
                $scope.ideas.push(data);
                $scope.sort_all();
                $scope.$apply();
                toast(msg);

            }

            function receive_comment(data) {
                var msg = "An idea was commented!";
                var index = get_IdeaIndex(data["idea"]);

                if (typeof $scope.ideas[index].comments == 'undefined') {
                    $scope.ideas[index].comments = [];
                }
                $scope.ideas[index].comments.unshift(data);
                // $scope.ideas[index].newest_comment = $scope.ideas[index].comments.length -1;
                $scope.sort_all();
                $scope.$apply();

            }

            function receive_vote(data) {
                var msg = "The vote of an idea was modified!";
                var index = get_IdeaIndex(data["idea_id"]);

                $scope.ideas[index].upvotes = data["upvotes"];
                $scope.ideas[index].downvotes = data["downvotes"];

                // $scope.ideas.push(data);
                $scope.sort_all();
                $scope.$apply();

            }

            //utility
            function get_IdeaIndex(idea_id) {
                for (var i = $scope.ideas.length - 1; i >= 0; i--) {
                    if ($scope.ideas[i].id == idea_id) {
                        return i;
                    }
                }
            }

            function get_CommentIndex(idea_index, comment_id) {
                for (var i = $scope.ideas[idea_index].comments.length - 1; i >= 0; i--) {
                    if ($scope.ideas[idea_index].comments[i].id == comment_id) {
                        return i;
                    }
                }
            }

            //table functions

            $scope.tableRowExpanded = false;
            $scope.tableRowIndexExpandedCurr = "";
            $scope.tableRowIndexExpandedPrev = "";

            $scope.selectTableRow = function (index) {
                if (typeof $scope.ideaCollapse === 'undefined') {
                    $scope.ideaCollapseFn();
                }

                if ($scope.tableRowExpanded === false && $scope.tableRowIndexExpandedCurr === "") {
                    $scope.tableRowIndexExpandedPrev = "";
                    $scope.tableRowExpanded = true;
                    $scope.tableRowIndexExpandedCurr = index;
                    $scope.ideaCollapse[index] = true;
                } else if ($scope.tableRowExpanded === true) {
                    if ($scope.tableRowIndexExpandedCurr === index) {
                        $scope.tableRowExpanded = false;
                        $scope.tableRowIndexExpandedCurr = "";
                        $scope.ideaCollapse[index] = false;
                    } else {
                        $scope.tableRowIndexExpandedPrev = $scope.tableRowIndexExpandedCurr;
                        $scope.tableRowIndexExpandedCurr = index;
                        $scope.ideaCollapse[$scope.tableRowIndexExpandedPrev] = false;
                        $scope.ideaCollapse[$scope.tableRowIndexExpandedCurr] = true;
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