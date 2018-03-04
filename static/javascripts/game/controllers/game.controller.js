(function () {
    'use strict';

    angular
        .module('crowdjump.game.controllers')
        .controller('GameController', GameController);


    GameController.$inject = ['$scope'];

    function GameController($scope) {
        var vm = this;

        // vm.num = 0;
        // vm.save = function () {
        //     $(".data").html("Click: " + $scope.num);
        //     $scope.num += 1;
        // };
        // vm.$on('$destroy', function () {
        //     // $scope.$emit('player leaving');
        // });

        vm.createPGame = function () {
            $scope.created = true;
            createGame("gameCanvas", $scope);
            $scope.remove = function () {
                elt.html('');
            };
        }


    }

})();