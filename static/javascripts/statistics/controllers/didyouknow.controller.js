(function () {
    'use strict';

    angular
        .module('crowdjump.statistics.controllers')
        .controller('DidyouknowController', DidyouknowController);

    DidyouknowController.$inject = ['$scope'];

    function DidyouknowController($scope) {
        var vm = this;
        $scope.didyouknow = '';

        $scope.getDidYouKnow = function () {
            var amountOfSlogans = 7;
            var rand = Math.floor(Math.random() * amountOfSlogans);
            var data = {
                "random": rand
            };
            $.ajax({
                url: '/didyouknow/',
                cache: false,
                data: data,
                success: function (data_new) {
                    $scope.didyouknow = "Did you know? " + JSON.parse(data_new).result;
                    console.log($scope.didyouknow);
                },
                error: function (data) {
                    // console.log("time:" + time + ' . ' + data);
                }
            });


        };
        $scope.getDidYouKnow();



    }
})();