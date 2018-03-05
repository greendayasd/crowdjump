/**
 * NewIdeaController
 * @namespace crowdjump.ideas.controllers
 */
(function () {
    'use strict';

    angular
        .module('crowdjump.ideas.controllers')
        .controller('NewIdeaController', NewIdeaController);

    NewIdeaController.$inject = ['$rootScope', '$scope', 'Authentication', 'Snackbar', 'Ideas'];

    /**
     * @namespace NewIdeaController
     */
    function NewIdeaController($rootScope, $scope, Authentication, Snackbar, Ideas) {
        var vm = this;

        vm.submit = submit;

        /**
         * @name submit
         * @desc Create a new Idea
         * @memberOf crowdjump.ideas.controllers.NewIdeaController
         */
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
                "version": 1,
                "request_text": vm.request_text,
                "description": vm.description,
                "estimated_time": null,
                "upvotes": 0,
                "downvotes": 0
            }
            Ideas.create(content).then(createIdeaSuccessFn, createIdeaErrorFn);


            /**
             * @name createIdeaSuccessFn
             * @desc Show snackbar with success message
             */
            function createIdeaSuccessFn(data, status, headers, config) {
                Snackbar.show('Success! New Idea submitted.');
            }


            /**
             * @name createIdeaErrorFn
             * @desc Propogate error event and show snackbar with error message
             */
            function createIdeaErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('idea.created.error');
                Snackbar.error(data.error);
            }
        }
    }
})();