
(function () {
    'use strict';

    angular
        .module('crowdjump.history.controllers')
        .controller('HistoryController', HistoryController);

    HistoryController.$inject = ['$scope'];

    function HistoryController($scope) {
        var vm = this;

        vm.columns = [];


    }
})();