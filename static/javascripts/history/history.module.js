(function () {
  'use strict';

  angular
    .module('crowdjump.history', [
      'crowdjump.history.controllers',
      'crowdjump.authentication.services'
    ]);

  angular
    .module('crowdjump.history.controllers', []);

  angular
    .module('crowdjump.history.services', ['ngCookies']);
})();