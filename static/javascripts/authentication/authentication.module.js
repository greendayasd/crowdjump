(function () {
  'use strict';

  angular
    .module('crowdjump.authentication', [
      'crowdjump.authentication.controllers',
      'crowdjump.authentication.services'
    ]);

  angular
    .module('crowdjump.authentication.controllers', []);

  angular
    .module('crowdjump.authentication.services', ['ngCookies']);
})();