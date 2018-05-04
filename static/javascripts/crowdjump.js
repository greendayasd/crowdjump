(function () {
    'use strict';

    angular
        .module('crowdjump', [
            'crowdjump.config',
            'crowdjump.routes',
            'crowdjump.authentication',
            'crowdjump.layout',
            'crowdjump.ideas',
            'crowdjump.utils',
            'crowdjump.chat',
            'crowdjump.history',
            'crowdjump.game',
            'crowdjump.menu',
            'crowdjump.version',
            'crowdjump.statistics',
        ]);

    angular
        .module('crowdjump.config', []);

    angular
        .module('crowdjump.routes', ['ngRoute']);


    angular
        .module('crowdjump.game', []);


    angular
        .module('crowdjump.menu', []);

    angular
        .module('crowdjump')
        .run(run);

    // angular.module('crowdjump.menu', ['ui.compat'])
    //     .config(function ($stateProvider) {
    //         // Our first state called `menu`
    //         $stateProvider
    //             .state('menu', {
    //                 url: '/menu',
    //                 templateUrl: '/static/templates/p_main.html',
    //                 // controller: 'MenuController'
    //             });
    //     });
    //
    // angular.module('crowdjump.game', ['ui.compat'])
    //     .config(function ($stateProvider) {
    //         $stateProvider
    //             .state('game', {
    //                 url: '/game',
    //                 abstract: false,
    //                 templateUrl: '/static/templates/p_game.html',
    //                 // template: '<div id="gameCanvas"><h1>test3</h1><button ng-click="createPGame()">Click2</button></div>',
    //                 controller: 'GameController',
    //             })
    //
    //     });

    angular.module('crowdjump.game')

        .controller('GameController', ['$scope', function ($scope) {
            $scope.num = 0;
            $scope.save = function () {
                $(".data").html("Click: " + $scope.num);
                $scope.num += 1;
            };
            $scope.$on('$destroy', function () {
                // $scope.$emit('player leaving');
            });

            $scope.createPGame = function () {
                $scope.created = true;
                createGame("gameCanvas", $scope);
                removeDummy();
                $scope.remove = function () {
                    elt.html('');
                };
            }

        }]);

    angular.module('crowdjump.game')
        .directive('gameCanvas', function ($injector) {
            // var linkFn =

            return {
                scope: {},
                template: '<div id="gameCanvas"><h1>TestCanvas</h1></div>',
                link: function () {
                    createGame("gameCanvas");
                }
            }
        });


    run.$inject = ['$http'];

    function run($http) {
        $http.defaults.xsrfHeaderName = 'X-CSRFToken';
        $http.defaults.xsrfCookieName = 'csrftoken';
    }

    function removeDummy() {
        var elem = document.getElementById('btn-create');
        elem.parentNode.removeChild(elem);
        return false;
    }
})();
