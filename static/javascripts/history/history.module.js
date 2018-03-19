(function () {
  'use strict';

  angular
    .module('crowdjump.history', [
      'crowdjump.history.controllers',
      'crowdjump.history.services'
    ]);

  angular
    .module('crowdjump.history.controllers', ['ui.bootstrap']);

  angular
    .module('crowdjump.history.services', []);
})();