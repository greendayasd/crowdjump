/**
* Idea
* @namespace crowdjump.ideas.directives
*/
(function () {
  'use strict';

  angular
    .module('crowdjump.ideas.directives')
    .directive('idea', idea);

  /**
  * @namespace Idea
  */
  function idea() {
    /**
    * @name directive
    * @desc The directive to be returned
    * @memberOf crowdjump.ideas.directives.Idea
    */
    var directive = {
      restrict: 'E',
      scope: {
        post: '='
      },
      templateUrl: '/static/templates/ideas/idea.html'
    };

    return directive;
  }
})();