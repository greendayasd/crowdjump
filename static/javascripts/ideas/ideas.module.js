(function () {
  'use strict';

  angular
    .module('crowdjump.ideas', [
      'crowdjump.ideas.controllers',
      'crowdjump.ideas.directives',
      'crowdjump.ideas.services'
    ]);

  angular
    .module('crowdjump.ideas.controllers', ['ngCookies', 'ui.bootstrap']);

  angular
    .module('crowdjump.ideas.directives', ['ngDialog']);

  angular
    .module('crowdjump.ideas.services', ['ngCookies', 'ui.bootstrap']);
})();