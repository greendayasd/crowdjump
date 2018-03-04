var app = angular.module('Crowdjump', []);

app.config(function ($locationProvider) {
    $locationProvider.html5Mode(false);
});

app.controller('AppController', ['$scope', '$http', function ($scope, $http) {

    $scope.posts = [
        user:
            username: 'Joe'
        title: 'Sample Post #1'
        body: 'This is the first sample post',

        user:
            username: 'Karen'
            title: 'Sample Post #2'
            body: 'This is another sample post'
    ]
}
])