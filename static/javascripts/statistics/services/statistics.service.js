
(function () {
    'use strict';

    angular
        .module('crowdjump.ideas.services')
        .factory('Ideas', Ideas);

    Ideas.$inject = ['$http', 'History'];

    function Ideas($http, History) {
        var Ideas = {
            all: all,
            create: create,
            get: get,
            deleteIdea: deleteIdea,
        };

        return Ideas;

        function all() {
            return $http.get('/api/v1/ideas/');
        }

        function create(content) {
            // console.error("Content: " + content["upvotes"]);
            return $http.post('/api/v1/ideas/', {
                version: content["version"],
                request_text: content["request_text"],
                description: content["description"],
                estimated_time: content["estimated_time"],
                upvotes: content["upvotes"],
                downvotes: content["downvotes"],
            });
            //   return $http.post('/api/v1/ideas/', {
            //     "version": content["version"],
            //     "request_text": content["request_text"],
            //     "description": content["description"],
            //     "estimated_time": null,
            //     "upvotes": 0,
            //     "downvotes": 0,
            // });
        }

        function get(username) {
            return $http.get('/api/v1/gameinfo/' + username + '/ideas/');
        }


    }
})();