
(function () {
  'use strict';

  angular
    .module('crowdjump.history.services')
    .factory('History', History);

  History.$inject = ['$http'];

  function History($http) {
    var History = {
      all: all,
      create: create,
      newest: newest,
    };

    return History;

    /**
    * @desc Get all History
    */
    function all() {
      return $http.get('/api/v1/history/');
    }

    function newest(){
      // return $http.get('/api/v1/history/' + newest_id + '/');
      return $http.get('/api/v1/history/?limit=1');
    }
    function create(content) {
      return $http.post('/api/v1/history/', {
        content: content
      });
    }
  }
})();