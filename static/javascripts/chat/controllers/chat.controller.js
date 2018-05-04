(function () {
    'use strict';

    angular
        .module('crowdjump.chat.controllers')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['$scope', 'Authentication', 'Snackbar', '$cookies'];

    function ChatController($scope, Authentication, Snackbar, $cookies) {
        var vm = this;

        vm.isAuthenticated = Authentication.isAuthenticated();
        // console.error(vm.isAuthenticated || false);
        vm.cookie = $cookies.getObject('authenticatedAccount');
        activate();

        function activate() {

        }
    }
})();