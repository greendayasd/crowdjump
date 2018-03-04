(function () {
    'use strict';

    angular
        .module('crowdjump.version.controllers')
        .controller('VersionController', VersionController);

    VersionController.$inject = ['$scope',];

    function VersionController($scope) {
        var vm = this;

        vm.version = "2";


    }
})();