var app = angular.module('app', [
    'ui.router',
    'app.menu',
    'app.game'
]);

app.config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');

    $stateProvider

    // HOME STATES AND NESTED VIEWS ========================================
        .state('home', {
            url: '/home',
            templateUrl: '/static/templates/p_index.html'
        })

        .state('about', {
            url: '/about',
            templateUrl: '/static/pages/about.html'

        })

        .state('history', {
            url: '/history',
            templateUrl: '/static/templates/p_history.html'

        })
        .state('ideas', {
            url: '/ideas',
            templateUrl: '/static/templates/p_ideas.html'

        });

});

angular.module('app.menu', [])
    .config(function ($stateProvider) {
        // Our first state called `menu`
        $stateProvider
            .state('menu', {
                url: '/menu',
                templateUrl: '/static/templates/layout/p_main.html',
                // controller: 'MenuController'
            });
    });

angular.module('app.game', [])
    .config(function ($stateProvider) {
        $stateProvider
            .state('game', {
                url: '/game',
                abstract: false,
                templateUrl: '/static/templates/layout/p_game.html',
                // template: '<div id="gameCanvas"><h1>test3</h1><button ng-click="createPGame()">Click2</button></div>',
                controller: 'GameController',
            })

    });

angular.module('app.game')

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
            $scope.remove = function () {
                elt.html('');
            };
        }

    }]);

angular.module('app.game')
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

function removeDummy() {
    var elem = document.getElementById('btn-create');
    elem.parentNode.removeChild(elem);
    return false;
}