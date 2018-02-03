/**
* IndexController
* @namespace crowdjump.layout.controllers
*/
(function () {
  'use strict';

  angular
    .module('crowdjump.layout.controllers')
    .controller('IndexController', IndexController);

  IndexController.$inject = ['$scope', 'Authentication', 'Ideas', 'Snackbar'];

  /**
  * @namespace IndexController
  */
  function IndexController($scope, Authentication, Ideas, Snackbar) {
    var vm = this;

    vm.isAuthenticated = Authentication.isAuthenticated();
    vm.ideas = [];

    activate();

    /**
    * @name activate
    * @desc Actions to be performed when this controller is instantiated
    * @memberOf crowdjump.layout.controllers.IndexController
    */
    function activate() {
      Ideas.all().then(ideasSuccessFn, ideasErrorFn);

      $scope.$on('idea.created', function (event, idea) {
        vm.ideas.unshift(idea);
      });

      $scope.$on('idea.created.error', function () {
        vm.ideas.shift();
      });


      /**
      * @name ideasSuccessFn
      * @desc Update ideas array on view
      */
      function ideasSuccessFn(data, status, headers, config) {
        vm.ideas = data.data;
      }


      /**
      * @name ideasErrorFn
      * @desc Show snackbar with error
      */
      function ideasErrorFn(data, status, headers, config) {
        Snackbar.error(data.error);
      }
    }
  }
})();