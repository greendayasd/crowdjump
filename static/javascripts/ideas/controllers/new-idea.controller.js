/**
 * NewIdeaController
 * @namespace crowdjump.ideas.controllers
 */
(function () {
    'use strict';

    angular
        .module('crowdjump.ideas.controllers')
        .controller('NewIdeaController', NewIdeaController);

    NewIdeaController.$inject = ['$rootScope', '$route', '$scope', 'Authentication', 'Snackbar', 'Ideas', 'History', '$mdToast'];

    function NewIdeaController($rootScope, $route, $scope, Authentication, Snackbar, Ideas, History, $mdToast) {
        var vm = this;

        vm.submit = submit;
        get_versions();

        function submit() {
            $scope.$broadcast('idea.created', {
                description: vm.description,
                request_text: vm.request_text,
                user: {
                    username: Authentication.getAuthenticatedAccount().username
                },
            });

            $scope.closeThisDialog();
            var content = {
                "version": $scope.newestVersion.label,
                "request_text": vm.request_text,
                "description": vm.description,
                "estimated_time": null,
                "upvotes": 0,
                "downvotes": 0
            }
            Ideas.create(content).then(createIdeaSuccessFn, createIdeaErrorFn);

            function createIdeaSuccessFn(data, status, headers, config) {
                // Snackbar.show('Success! New Idea submitted.');
                $route.reload();
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Idea created")
                        .hideDelay(2000)
                );
            }

            function createIdeaErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('idea.created.error');

                $mdToast.show(
                    $mdToast.simple()
                        .textContent(data.error)
                        .hideDelay(2000)
                );
                // Snackbar.error(data.error);
            }
        }

        function get_versions() {
            History.all().then(historySuccessFn, historyErrorFn);

            function historySuccessFn(data, status, headers, config) {
                $scope.versions = data.data;
                $scope.newestVersion = $scope.versions[0];
                console.error("data " + data.data);
                console.error("v  " + $scope.newestVersion.label);

            }

            function historyErrorFn(data, status, headers, config) {
                Snackbar.error(data.error);
                console.error(data.error);
            }
        }
    }
})();