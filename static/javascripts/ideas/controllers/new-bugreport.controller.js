
(function () {
    'use strict';

    angular
        .module('crowdjump.ideas.controllers')
        .controller('NewBugreportController', NewBugreportController);

    NewBugreportController.$inject = ['$rootScope', '$route', '$scope', 'Authentication', 'Bugreports', 'History', '$mdToast'];

    function NewBugreportController($rootScope, $route, $scope, Authentication, Bugreports, History, $mdToast) {
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
            Bugreports.create(content).then(createBugreportSuccessFn, createBugreportErrorFn);

            function createBugreportSuccessFn(data, status, headers, config) {

                $scope.$broadcast('bugreport.created', {
                    description: vm.description,
                    request_text: vm.request_text,
                    user: {
                        username: Authentication.getAuthenticatedAccount().username
                    },
                });
                var content = data["data"];
                content["type"] = 'bugreport_broadcast';
                broadcast_bugreport(content);
            }

            function createBugreportErrorFn(data, status, headers, config) {
                $rootScope.$broadcast('bugreport.created.error');
                console.log(data);
                var msg = "There was an error, the bug report was not created!";
                toast(msg);
            }

        }

        var ws_scheme = 'wss'; //window.location.protocol == "https:" ? "wss" : "ws";
        var port = ':8001';

        if (window.location.host == "localhost:8000") {
            ws_scheme = 'ws';
            port = '';
        }
        var bugreportSocket = new WebSocket(
            ws_scheme + '://' + window.location.host + port +
            '/ws/bugreports/');

        function broadcast_bugreport(content) {

            bugreportSocket.onclose = function (e) {
                console.error('Bugreport socket closed unexpectedly ' + e);
            };

            bugreportSocket.send(JSON.stringify(content));

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