(function () {
    'use strict';

    angular
        .module('crowdjump.layout.controllers')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', 'Authentication'];

    function NavbarController($scope, Authentication) {
        var vm = this;
        var cookie = Authentication.getAuthenticatedAccount();
        vm.isAuthenticated = Authentication.isAuthenticated();
        if (cookie != null){
            vm.surveystatus = cookie["survey_status"];
        }
        vm.isIE = (false || !!document.documentMode);


        vm.logout = logout;

        function logout() {
            Authentication.logout();
        }
    }
})();