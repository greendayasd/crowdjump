(function () {
        'use strict';

        angular
            .module('crowdjump.admin.controllers')
            .controller('DataController', DataController);

        DataController.$inject = ['$scope', 'Authentication', 'Ideas', 'Comments', 'History', 'Votes', '$http'];

        function DataController($scope, Authentication, Ideas, Comments, History, Votes, $http) {
            var vm = this;
            vm.isAuthenticated = Authentication.isAuthenticated();
            vm.cookie = Authentication.getAuthenticatedAccount();
            vm.url = window.location.pathname;

            if (vm.url.includes("data")) {
                loadAccounts();
                loadVersions();
                loadIdeas();
                loadIdeavotes();
                loadGameinfo();
            }

            function loadAccounts() {
                $scope.accounts = $http.get('/api/v1/accounts/');
                console.log("finished 1 of 5");
            }

            function loadVersions() {
                History.all().then(historySuccessFn, historyErrorFn);

                function historySuccessFn(data, status, headers, config) {
                    $scope.versions = data.data;
                    $scope.newestVersion = $scope.versions[0];
                console.log("finished 2 of 5");

                }

                function historyErrorFn(data, status, headers, config) {
                    console.error(data.error);
                }

            }

            function loadIdeas() {
                Ideas.all().then(ideasSuccessFn, ideasErrorFn);

                function ideasSuccessFn(data, status, headers, config) {
                    $scope.ideas = data.data;
                console.log("finished 3 of 5");

                }

                function ideasErrorFn(data, status, headers, config) {
                    var msg = "Could not get ideas";
                    console.log(msg);
                }

            }

            function loadIdeavotes() {
                Votes.all().then(ideavotesSuccessFn, ideavotesErrorFn);

                function ideavotesSuccessFn(data, status, headers, config) {
                    $scope.ideavotes = data.data;
                console.log("finished 4 of 5");
                }

                function ideavotesErrorFn(data, status, headers, config) {
                }

            }

            function loadGameinfo() {
                $scope.gamedata = $http.get('/api/v1/gameinfo/');
                console.log("finished 5 of 5");

            }

            $scope.sortByUserData = function () {
                var statistics = '';
                var header = form_csv('id', 'username', 'register_version', 'ideas', 'versions_played');

                //find own votes for ideas
                $scope.accounts = $.map($scope.accounts, function (user) {
                    var ideas = $.grep($scope.ideas, function (idea) {
                        return idea.userid === user.id;
                    })[0];
                    if (typeof idea !== 'undefined') {
                        user.ideas = ideas;
                    } else {
                        user.ideas = [];
                    }

                    return user;
                });

                for (var i = 0; i < $scope.accounts.length; i++) {
                    var acc = $scope.accounts[i];
                    statistics += form_csv(acc.id,acc.username,'',acc.ideas.length,'');
                }
                $scope.csv = header + statistics;
            }

        }
    }

)();