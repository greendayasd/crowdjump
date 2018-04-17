(function () {
    'use strict';

    angular
        .module('crowdjump.ideas.services')
        .factory('Comments', Comments);

    Comments.$inject = ['$http', 'History'];


    function Comments($http, History) {
        var Comments = {
            all: all,
            create: create,
            get: get,
            deleteComment: deleteComment,
        };

        return Comments;


        function all() {
            return $http.get('/api/v1/comments?deleted=false');
        }

        function create(content) {
            // console.error("Content: " + content["upvotes"]);
            return $http.post('/api/v1/comments/', {
                idea: content["idea"],
                text: content["text"],
                status: content["status"],
                upvotes: content["upvotes"],
                downvotes: content["downvotes"],
            });
        }

        function get(idea) {
            return $http.get('/api/v1/comments/?idea=' + idea + '&deleted=false/');
        }


        function deleteComment(id){
            return $http.patch('/api/v1/comments/' + id +'/', {
                deleted: true
            })
        }

    }
})();