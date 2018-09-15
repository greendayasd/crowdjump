(function () {
    'use strict';

    angular
        .module('crowdjump.authentication.controllers')
        .controller('UnsubscribeController', UnsubscribeController);

    UnsubscribeController.$inject = ['$scope', 'Authentication', '$mdToast'];

    function UnsubscribeController($scope, Authentication, $mdToast) {
        var vm = this;
        vm.isAuthenticated = Authentication.isAuthenticated();
        vm.submit = submit;

    }

    function submit() {
        var data = '';
        $.ajax({
            url: '/unsubscribeNL/',
            data: data,
            success: function (data) {
            },
            error: function (data) {
            }
        });
        alert("Succesfully unsubscribed!");
        window.location.href = '/';
    }

    function toast(msg) {
        var toast = $mdToast.simple().textContent(msg)
            .parent($("#toast-container"));
        $mdToast.show(toast);
    }
})();