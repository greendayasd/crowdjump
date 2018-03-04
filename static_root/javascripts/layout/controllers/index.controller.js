/**
 * IndexController
 * @namespace crowdjump.layout.controllers
 */
(function () {
    'use strict';

    angular
        .module('crowdjump.layout.controllers')
        .controller('IndexController', IndexController);

    IndexController.$inject = ['$scope', 'Authentication', 'Snackbar'];

    /**
     * @namespace IndexController
     */
    function IndexController($scope, Authentication, Ideas, Snackbar) {
        var vm = this;

        vm.isAuthenticated = Authentication.isAuthenticated();
        vm.ideas = [];

        activate();

        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf crowdjump.layout.controllers.IndexController
         */
        function activate() {

        }
    }
})();