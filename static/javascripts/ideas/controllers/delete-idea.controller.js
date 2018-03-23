(function () {
    'use strict';

    angular
        .module('crowdjump.ideas.controllers')
        .controller('DeleteIdeaController', DeleteIdeaController);


    DeleteIdeaController.$inject = ['$rootScope', '$route', '$scope', 'Snackbar', 'Ideas'];
    // DeleteIdeaController.$inject = ['$rootScope', '$scope',  '$route', 'Authentication', 'Ideas'];


    // function DeleteIdeaController(id, $scope, $route, Authentication, Snackbar, Ideas) {
    function DeleteIdeaController($rootScope, $route, $scope, Snackbar, Ideas) {
        var vm = this;
        var canDelete = false;
        $scope.submit = submit;

        // $scope.id = id;


        function closeDialog() {
            console.error("Test");

        }

        function submit() {
            // alert("delete " + this.id);

            if (canDelete) {
                Ideas.deleteIdea(this.id).then(deleteSuccessFn, deleteErrorFn);
                // console.error("delete");

            } else {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("You can't delete your ideas at the moment, the next implementation is chosen soon!")
                        .hideDelay(2000)
                );
                // alert();
                $route.reload();
            }


            $scope.closeThisDialog();

            // Snackbar.show("Post deleted");

            function deleteSuccessFn(data, status, headers, config) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Idea deleted")
                        .hideDelay(2000)
                );
                // $route.reload();
            }

            function deleteErrorFn(data, status, headers, config) {
                $mdToast.show(
                    $mdToast.simple()
                        .textContent("Idea was not deleted!")
                        .hideDelay(2000)
                );
                console.error(data.error);

            }
        }


        $scope.setId = function (id) {
            $scope.id = id;
            alert("set" + id);
            console.error($scope.id);
        }

    }
})();