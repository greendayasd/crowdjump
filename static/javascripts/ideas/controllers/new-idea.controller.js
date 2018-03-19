/**
 * NewIdeaController
 * @namespace crowdjump.ideas.controllers
 */
(function () {
    'use strict';

    angular
        .module('crowdjump.ideas.controllers')
        .controller('NewIdeaController', NewIdeaController);

    NewIdeaController.$inject = ['$rootScope', '$route', '$scope', 'Authentication', 'Snackbar', 'Ideas'];

    function NewIdeaController($rootScope, $route, $scope, Authentication, Snackbar, Ideas) {
        var vm = this;

        vm.submit = submit;

        function submit() {
            alert("???");
            $scope.$broadcast('idea.created', {
                description: vm.description,
                request_text: vm.request_text,
                user: {
                    username: Authentication.getAuthenticatedAccount().username
                },
            });

            $scope.closeThisDialog();
            var content = {
                "version": 1,
                "request_text": vm.request_text,
                "description": vm.description,
                "estimated_time": null,
                "upvotes": 0,
                "downvotes": 0
            }
            Ideas.create(content).then(createIdeaSuccessFn, createIdeaErrorFn);

            function createIdeaSuccessFn(data, status, headers, config) {
                Snackbar.show('Success! New Idea submitted.');
                $route.reload();
            }

            function createIdeaErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('idea.created.error');
                Snackbar.error(data.error);
            }
        }
    }
})();