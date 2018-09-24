(function () {
    'use strict';

    angular
        .module('crowdjump.layout.controllers')
        .controller('NavbarController', NavbarController);

    NavbarController.$inject = ['$scope', 'Authentication', 'History'];

    function NavbarController($scope, Authentication, History) {
        var vm = this;
        var cookie = Authentication.getAuthenticatedAccount();
        $scope.winner = winner7days;
        $scope.wins = wins7days;


        $scope.version = versionlabel;
        // getVersion();

        vm.isAuthenticated = Authentication.isAuthenticated();
        if (cookie != null) {
            vm.surveystatus = cookie["survey_status"];
        }
        vm.isIE = (false || !!document.documentMode);


        vm.logout = logout;


        function getVersion() {
            History.newest().then(historySuccessFn, historyErrorFn);

            function historySuccessFn(data, status, headers, config) {
                $scope.version = data.data["results"][0];
                $scope.$apply;
                versionlabel = $scope.version.label;
                versionnumber = $scope.version.id;
            }

            function historyErrorFn(data, status, headers, config) {
                // console.error(data.error);
            }
        }

        function logout() {
            if (!vm.isAuthenticated) return;
            Authentication.logout();
        }


        // timer
        var $clock = $('#clock'),
            eventTime = nextVote,
            currentTime = moment().unix(),
            diffTime = eventTime - currentTime,
            duration = moment.duration(diffTime * 1000, 'milliseconds'),
            interval = 1000;

        // if time to countdown
        if (diffTime > 0) {
            setInterval(function () {

                duration = moment.duration(duration.asMilliseconds() - interval, 'milliseconds');
                if(duration < 0){
                    $scope.clock = '00:00:00';
                    return;
                }
                var d = moment.duration(duration).days(),
                    h = moment.duration(duration).hours(),
                    m = moment.duration(duration).minutes(),
                    s = moment.duration(duration).seconds();

                $scope.clock = '';

                if (d > 0) {
                    d = $.trim(d).length === 1 ? '0' + d : d;
                    $scope.clock += d + ' day';
                    $scope.clock+= d > 1 ? 's ' : ' ';
                }
                h = $.trim(h).length === 1 ? '0' + h : h;
                m = $.trim(m).length === 1 ? '0' + m : m;
                s = $.trim(s).length === 1 ? '0' + s : s;


                $scope.clock += h + ':' + m + ':' + s;

                $scope.$apply();

            }, interval);

        } else{
            $scope.clock = '00:00:00';
        }
    }
})();