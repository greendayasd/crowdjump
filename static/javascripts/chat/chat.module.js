(function () {
  'use strict';

  angular
    .module('crowdjump.chat', [
      'crowdjump.chat.controllers',
      'crowdjump.chat.services'
    ]);

  angular
    .module('crowdjump.chat.controllers', ['ui.bootstrap']);

  angular
    .module('crowdjump.chat.services', []);
})();