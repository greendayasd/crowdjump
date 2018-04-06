(function () {
  'use strict';

  angular
    .module('crowdjump.statistics', [
      'crowdjump.statistics.controllers',
      'crowdjump.statistics.directives',
      'crowdjump.statistics.services'
    ]);

  angular
    .module('crowdjump.statistics.controllers', ['ngCookies', 'ui.bootstrap', 'ngDialog', 'ngMaterial', 'ngMessages',]);

  angular
    .module('crowdjump.statistics.directives', ['ngDialog']);

  angular
    .module('crowdjump.statistics.services', ['ngCookies', 'ui.bootstrap']);
})();