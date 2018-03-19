(function () {
    'use strict';

    angular
        .module('crowdjump.ideas.controllers')
        .controller('DeleteIdeaController', DeleteIdeaController);


    DeleteIdeaController.$inject = ['$rootScope', '$route', '$scope', 'Authentication', 'Snackbar', 'Ideas'];

    function DeleteIdeaController($rootScope, $route, $scope, Authentication, Snackbar, Ideas) {
        var vm = this;
        var canDelete = true;
        vm.submit = submit;

        alert($rootScope);
        alert($rootScope.idea);

        function submit() {

            if (canDelete) {
                // alert("delete??");
                Ideas.deleteIdea($scope.id).then(deleteSuccessFn, deleteErrorFn);
                // console.error("delete");

            } else {
                alert("You can't delete your ideas at the moment, the next implementation is chosen soon!");
                console.error("cant delete");
                $route.reload();
            }


            $scope.closeThisDialog();

            function deleteSuccessFn(data, status, headers, config) {
                Snackbar.show("Post deleted");
                $route.reload();
            }

            function deleteErrorFn(data, status, headers, config) {
                Snackbar.error(data.error);
                console.error(data.error);

            }
        }


        $scope.setId = function (id) {
            $scope.id = id;
            alert(id);
            console.error($scope.id);
        }

    }
})();