/**
 * Ideas
 * @namespace crowdjump.ideas.services
 */
(function () {
    'use strict';

    angular
        .module('crowdjump.ideas.services')
        .factory('Ideas', Ideas);

    Ideas.$inject = ['$http', 'History'];

    /**
     * @namespace Ideas
     * @returns {Factory}
     */
    function Ideas($http, History) {
        var Ideas = {
            all: all,
            create: create,
            get: get,
            deleteIdea: deleteIdea,
        };

        return Ideas;

        ////////////////////

        /**
         * @name all
         * @desc Get all Ideas
         * @returns {Promise}
         * @memberOf crowdjump.ideas.services.Ideas
         */
        function all() {
            return $http.get('/api/v1/ideas/');
        }


        /**
         * @name create
         * @desc Create a new Idea
         * @param {string} content The content of the new Idea
         * @returns {Promise}
         * @memberOf crowdjump.ideas.services.Ideas
         */
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

        /**
         * @name get
         * @desc Get the Ideas of a given user
         * @param {string} username The username to get Ideas for
         * @returns {Promise}
         * @memberOf crowdjump.ideas.services.Ideas
         */
        function get(username) {
            return $http.get('/api/v1/accounts/' + username + '/ideas/');
        }


        function deleteIdea(id){
            return $http.delete('/api/v1/ideas/' + id +'/');
        }

    }
})();