/**
* Ideas
* @namespace crowdjump.ideas.services
*/
(function () {
  'use strict';

  angular
    .module('crowdjump.ideas.services')
    .factory('Ideas', Ideas);

  Ideas.$inject = ['$http'];

  /**
  * @namespace Ideas
  * @returns {Factory}
  */
  function Ideas($http) {
    var Ideas = {
      all: all,
      create: create,
      get: get
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
      return $http.post('/api/v1/ideas/', {
        content: content
      });
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
  }
})();