
(function () {
  'use strict';

  angular
    .module('crowdjump.chat.services')
    .factory('Chat', Chat);

  Chat.$inject = ['$http'];

  function Chat($http) {
    var Chat = {
      all: all,
      create: create,
      newestX: newestX,
    };

    return Chat;

    function all() {
      return $http.get('/api/v1/chatmessages/');
    }

    function newestX(amount){
      return $http.get('/api/v1/chatmessages/?limit=' + amount);
    }
    function create(content) {
      return $http.post('/api/v1/chatmessages/', {
        content: content
      });
    }
  }
})();