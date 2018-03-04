(function () {
    'use strict';

    angular
        .module('crowdjump.game.directives')
        .directive('gameCanvas', gameCanvas);

    gameCanvas.$inject = ['$injector'];

    function gameCanvas($injector) {

        var directive = {
            restrict: 'E',
            scope: {},
            template: '<div id="gameCanvas"><h1>TestCanvas</h1></div>',
            link: function () {
                createGame("gameCanvas");
            }
        };

        return directive;
    }
})();