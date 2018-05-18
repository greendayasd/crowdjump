(function () {
    'use strict';

    angular
        .module('crowdjump.chat.controllers')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['$scope', 'Authentication', 'Chat'];

    function ChatController($scope, Authentication, Chat) {
        var vm = this;
        $scope.chatMessages = [];

        vm.isAuthenticated = Authentication.isAuthenticated();
        // console.error(vm.isAuthenticated || false);
        // vm.cookie = $cookies.getObject('authenticatedAccount');
        activate();

        function activate() {
            Chat.all().then(chatSuccessFn, chatErrorFn);

            function chatSuccessFn(data, status, headers, config) {
                $scope.chatMessages = data.data;
                // console.log($scope.chatMessages[0]);

            }

            function chatErrorFn(data, status, headers, config) {
                console.error(data.error);
            }

        }
    }
})();