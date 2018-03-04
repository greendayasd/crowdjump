(function () {
    'use strict';

    angular
        .module('crowdjump.game.controllers')
        .controller('GameController', GameController);
.
    directive('gameCanvas', gameCanvas);

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

    gameCanvas.$inject = ['$scope', '$injector'];

    function gameCanvas($injector) {
        return {
            scope: {},
            template: '<div id="gameCanvas"><h1>TestCanvas</h1></div>',
            link: function () {
                createGame("gameCanvas");
            }
        }
    }
})();