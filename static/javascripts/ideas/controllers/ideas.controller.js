/**
 * IdeasController
 * @namespace crowdjump.ideas.controllers
 */
(function () {
    'use strict';

    angular
        .module('crowdjump.ideas.controllers')
        .controller('IdeasController', IdeasController);

    IdeasController.$inject = ['$scope'];

    /**
     * @namespace IdeasController
     */
    function IdeasController($scope) {
        var vm = this;

        vm.columns = [];
        activate();


        /**
         * @name activate
         * @desc Actions to be performed when this controller is instantiated
         * @memberOf crowdjump.ideas.controllers.IdeasController
         */
        function activate() {
            $scope.$watchCollection(function () {
                return $scope.ideas;
            }, render);
            $scope.$watch(function () {
                return $(window).width();
            }, render);
        }


        /**
         * @name calculateNumberOfColumns
         * @desc Calculate number of columns based on screen width
         * @returns {Number} The number of columns containing Ideas
         * @memberOf crowdjump.ideas.controllers.IdeasControllers
         */
        function calculateNumberOfColumns() {
            var width = $(window).width();

            // if (width >= 1200) {
            //     return 4;
            // } else if (width >= 992) {
            //     return 3;
            // } else if (width >= 768) {
            //     return 2;
            // } else {
            //     return 1;
            // }

            //immer vor 1 column vorerst
            return 1;
        }


        /**
         * @name approximateShortestColumn
         * @desc An algorithm for approximating which column is shortest
         * @returns The index of the shortest column
         * @memberOf crowdjump.ideas.controllers.IdeasController
         */
        function approximateShortestColumn() {
            var scores = vm.columns.map(columnMapFn);

            return scores.indexOf(Math.min.apply(this, scores));


            /**
             * @name columnMapFn
             * @desc A map function for scoring column heights
             * @returns The approximately normalized height of a given column
             */
            function columnMapFn(column) {
                var collen = column.length
                var lenghts = [collen];
                for (var i = 0; i < collen; i++) {
                    // var contentLength = vm.columns.get('content.length')
                    // lenghts[i] = contentLength;
                    lenghts[i] = 0;
                };

                // var lengths = column.map(function (element) {
                //   return element.content.length;
                // });
                if (collen > 0) {
                    return lenghts.reduce(sum, 0) * column.length;
                };
                return 0;
            }


            /**
             * @name sum
             * @desc Sums two numbers
             * @params {Number} m The first number to be summed
             * @params {Number} n The second number to be summed
             * @returns The sum of two numbers
             */
            function sum(m, n) {
                return m + n;
            }
        }


        /**
         * @name render
         * @desc Renders Ideas into columns of approximately equal height
         * @param {Array} current The current value of `vm.ideas`
         * @param {Array} original The value of `vm.ideas` before it was updated
         * @memberOf crowdjump.ideas.controllers.IdeasController
         */
        function render(current, original) {
            if (current !== original) {
                vm.columns = [];

                for (var i = 0; i < calculateNumberOfColumns(); ++i) {
                    vm.columns.push([]);
                }

                for (var i = 0; i < current.length; ++i) {
                    var column = approximateShortestColumn();

                    vm.columns[column].push(current[i]);
                    // console.error("Zeile" + i + ": " + current[i]);
                }
            }
        }
    }
})();