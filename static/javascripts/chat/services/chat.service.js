
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
      newest20: newest20,
    };

    return Chat;

    function all() {
      return $http.get('/api/v1/chatmessages/');
    }

    function newest20(){
      return $http.get('/api/v1/chatmessages/?limit=20');
    }
    function create(content) {
      return $http.post('/api/v1/chatmessages/', {
        content: content
      });
    }
  }
})();