/**
 * Register controller
 * @namespace crowdjump.authentication.controllers
 */
(function () {
    'use strict';

    angular
        .module('crowdjump.authentication.controllers')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$location', '$scope', 'Authentication'];

    /**
     * @namespace RegisterController
     */
    function RegisterController($location, $scope, Authentication) {
        var vm = this;

        vm.register = register;

        /**
         * @name register
         * @desc Register a new user
         * @memberOf crowdjump.authentication.controllers.RegisterController
         */
        function register() {
            Authentication.register(vm.email, vm.password, vm.username);
        }


        activate();

        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf crowdjump.authentication.controllers.RegisterController
         */
        function activate() {
            // If the user is authenticated, they should not be here.
            if (Authentication.isAuthenticated()) {
                 // console.log("after register" + Authentication.isAuthenticated());
                $location.url('/');
            }
        }
    }
})();