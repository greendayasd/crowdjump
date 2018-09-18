(function () {
    'use strict';

    angular
        .module('crowdjump.layout.controllers')
        .controller('IndexController', IndexController);

    IndexController.$inject = ['$scope', 'Authentication', 'Ideas'];

    function IndexController($scope, Authentication, Ideas) {
        var vm = this;
        vm.isAuthenticated = Authentication.isAuthenticated();
        vm.ideas = [];
        activate();

        function activate() {
            Ideas.all().then(ideasSuccessFn, ideasErrorFn);

            $scope.$on('idea.created', function (event, idea) {
                vm.ideas.unshift(idea);
            });

            $scope.$on('idea.created.error', function () {
                vm.ideas.shift();
            });

            function ideasSuccessFn(data, status, headers, config) {
                vm.ideas = data.data;
            }

            function ideasErrorFn(data, status, headers, config) {
            }
        }
        //
        // vm.submit = submit;
        //
        // function csrfSafeMethod(method) {
        //     return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
        // }
        //
        // function submit() {
        //     var csrftoken = getAuthCookie('csrftoken');
        //     $.ajaxSetup({
        //         beforeSend: function (xhr, settings) {
        //             if (!csrfSafeMethod(settings.type)) {
        //                 xhr.setRequestHeader("X-CSRFTOKEN", csrftoken);
        //             }
        //         }
        //     });
        // }
    }
})();