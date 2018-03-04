(function () {
    'use strict';

    angular
        .module('crowdjump.ideas.controllers')
        .controller('IdeasController', IdeasController);

    IdeasController.$inject = ['$scope'];

    function IdeasController($scope) {
        var vm = this;

        vm.columns = [];

        activate();

        function activate() {
            $scope.$watchCollection(function () {
                return $scope.ideas;
            }, render);
            $scope.$watch(function () {
                return $(window).width();
            }, render);
        }

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
                }
            }
        }
    }
})();