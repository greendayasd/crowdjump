(function () {
  'use strict';

  angular
    .module('crowdjump.version', [
      'crowdjump.version.controllers',
      'crowdjump.version.services'
    ]);

  angular
    .module('crowdjump.version.controllers', []);

  angular
    .module('crowdjump.version.services', ['ngCookies']);
})();