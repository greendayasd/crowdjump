(function () {
    'use strict';

    angular
        .module('crowdjump.layout.controllers')
        .controller('UnsubscribeController', UnsubscribeController);

    UnsubscribeController.$inject = ['$scope', 'Authentication'];

    function UnsubscribeController($scope, Authentication) {
        var vm = this;
        var cookie = Authentication.getAuthenticatedAccount();


    }
})();