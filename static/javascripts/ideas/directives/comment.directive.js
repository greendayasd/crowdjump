
(function () {
  'use strict';

  angular
    .module('crowdjump.ideas.directives')
    .directive('comment', comment);

  function comment() {

    var directive = {
      restrict: 'E',
      scope: {
        comment: '='
      },
      templateUrl: '/static/templates/ideas/comment.html'
    };

    return directive;
  }
})();