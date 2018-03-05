(function () {
  'use strict';

  angular
    .module('crowdjump.layout', [
      'crowdjump.layout.controllers'
    ]);

  angular
    .module('crowdjump.layout.controllers', ['ngCookies']);
})();