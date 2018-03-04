
(function () {
  'use strict';

  angular
    .module('crowdjump.history.services')
    .factory('History', History);

  History.$inject = ['$http'];

  function History($http) {
    var Ideas = {
      all: all,
      create: create,
      get: get
    };

    return Ideas;

    /**
    * @desc Get all History
    */
    function all() {
      return $http.get('/api/v1/history/');
    }

    function create(content) {
      return $http.post('/api/v1/history/', {
        content: content
      });
    }
  }
})();