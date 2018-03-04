/**
* Posts
* @namespace crowdjump.ideas.directives
*/
(function () {
  'use strict';

  angular
    .module('crowdjump.ideas.directives')
    .directive('ideas', ideas);

  /**
  * @namespace ideas
  */
  function ideas() {
    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf crowdjump.ideas.directives.Ideas
    */
    var directive = {
      controller: 'IdeasController',
      controllerAs: 'vm',
      restrict: 'E',
      scope: {
        ideas: '='
      },
      templateUrl: '/static/templates/ideas/ideas.html'
    };

    return directive;
  }
})();