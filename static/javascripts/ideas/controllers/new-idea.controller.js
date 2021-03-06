/**
 * NewIdeaController
 * @namespace crowdjump.ideas.controllers
 */
(function () {
    'use strict';

    angular
        .module('crowdjump.ideas.controllers')
        .controller('NewIdeaController', NewIdeaController);

    NewIdeaController.$inject = ['$rootScope', '$route', '$scope', 'Authentication', 'Ideas', 'History', '$mdToast'];

    function NewIdeaController($rootScope, $route, $scope, Authentication, Ideas, History, $mdToast) {
        var vm = this;
        var content;
        vm.submit = submit;

        // get_versions();

        function submit() {
            if (vm.description == undefined && vm.request_text == undefined) {
                $scope.closeThisDialog();
                return;
            }

            $scope.closeThisDialog();

            content = {
                "request_text": vm.request_text,
                "description": vm.description,
                "estimated_time": null
            }
            Ideas.create(content).then(createIdeaSuccessFn, createIdeaErrorFn);

            function createIdeaSuccessFn(data, status, headers, config) {

                $scope.$broadcast('idea.created', {
                    description: vm.description,
                    request_text: vm.request_text,
                    user: {
                        username: Authentication.getAuthenticatedAccount().username
                    },
                });
                var content = data["data"];
                content["type"] = 'idea_broadcast';
                broadcast_idea(content);
                // toast("Idea created"); //websocket
            }

            function createIdeaErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('idea.created.error');
                console.log(data);
                var msg = "There was an error, the idea was not created!";
                toast(msg);
            }

        }

        var ws_scheme = 'wss'; //window.location.protocol == "https:" ? "wss" : "ws";
        var port = ':8001';

        if (window.location.host == "localhost:8000") {
            ws_scheme = 'ws';
            port = '';
        }
        var ideaSocket = new WebSocket(
            ws_scheme + '://' + window.location.host + port +
            '/ws/ideas/');

        function broadcast_idea(content) {

            ideaSocket.onclose = function (e) {
                console.error('Chat socket closed unexpectedly ' + e);
            };

            ideaSocket.send(JSON.stringify(content));

        }

        function get_versions() {
            History.all().then(historySuccessFn, historyErrorFn);

            function historySuccessFn(data, status, headers, config) {
                $scope.versions = data.data;
                $scope.newestVersion = $scope.versions[0];

            }

            function historyErrorFn(data, status, headers, config) {
                console.error(data.error);
            }
        }

        function toast(msg) {
            var toast = $mdToast.simple().textContent(msg)
                .parent($("#toast-container"));
            $mdToast.show(toast);
        }
    }
})();