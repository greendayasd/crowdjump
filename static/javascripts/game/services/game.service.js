
(function () {
  'use strict';

  angular
    .module('crowdjump.game.services')
    .factory('Game', Game);

  Game.$inject = ['$http'];

  function Game($http) {
    var GameInfo = {
      addWin: addWin,
      addTry: addTry,
    };

    return GameInfo;

    function addWin(content) {
      return $http.post('/api/v1/game/', {
        content: content
      });
    }

    function addTry(content) {
      return $http.post('/api/v1/game/', {
        content: content
      });
    }
  }
})();