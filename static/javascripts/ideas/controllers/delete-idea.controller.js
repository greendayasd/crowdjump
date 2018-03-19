(function () {
    'use strict';

    angular
        .module('crowdjump.ideas.controllers')
        .controller('DeleteIdeaController', DeleteIdeaController);


    DeleteIdeaController.$inject = ['$rootScope', '$route', '$scope', 'Authentication', 'Snackbar', 'Ideas'];

    function DeleteIdeaController($scope, id, $route, Authentication, Snackbar, Ideas) {
        var vm = this;
        var canDelete = false;
        $scope.submit = submit;
        $scope.id = id;


        function submit() {
            alert("delete " + this.id);

            if (canDelete) {
                Ideas.deleteIdea(this.id).then(deleteSuccessFn, deleteErrorFn);
                // console.error("delete");

            } else {
                alert("You can't delete your ideas at the moment, the next implementation is chosen soon!");
                var options = {
                    content: "Some text", // text of the snackbar
                    style: "toast", // add a custom class to your snackbar
                    timeout: 1000 // time in milliseconds after the snackbar autohides, 0 is disabled
                }
                Snackbar.show(options);
                // console.error("cant delete");
                // $route.reload();
            }


            $scope.closeThisDialog();

            // $uibModal.close();

            function deleteSuccessFn(data, status, headers, config) {
                Snackbar.show("Post deleted");
                // $route.reload();
            }

            function deleteErrorFn(data, status, headers, config) {
                Snackbar.error(data.error);
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