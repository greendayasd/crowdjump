/**
 * Authentication
 * @namespace authentication.services
 */
(function () {
    'use strict';

    angular
        .module('crowdjump.authentication.services')
        .factory('Authentication', Authentication);

    Authentication.$inject = ['$cookies', '$rootScope', '$http', '$mdToast', 'Statistics'];

    /**
     * @namespace Authentication
     * @returns {Factory}
     */
    function Authentication($cookies, $rootScope, $http, $mdToast, Statistics) {
        /**
         * @name Authentication
         * @desc The Factory to be returned
         */
        var Authentication = {
            getAuthenticatedAccount: getAuthenticatedAccount,
            isAuthenticated: isAuthenticated,
            login: login,
            logout: logout,
            register: register,
            setAuthenticatedAccount: setAuthenticatedAccount,
            unauthenticate: unauthenticate
        };

        return Authentication;

        ////////////////////

        /**
         * @name register
         * @desc Try to register a new user
         * @param {string} username The username entered by the user
         * @param {string} password The password entered by the user
         * @param {string} email The email entered by the user
         * @returns {Promise}
         * @memberOf crowdjump.authentication.services.Authentication
         */
        function register(email, password, username) {
            return $http.post('/api/v1/accounts/', {
                username: username,
                password: password,
                email: email,

            }).then(registerSuccessFn, registerErrorFn);

            /**
             * @name registerSuccessFn
             * @desc Log the new user in
             */
            function registerSuccessFn(data, status, headers, config) {
                /**
                 * Bei Registrierung Statistik für neuste Version anlegen
                 */
                Authentication.login(email, password);
            }

            /**
             * @name registerErrorFn
             * @desc Log "Epic failure!" to the console
             */
            function registerErrorFn(data, status, headers, config) {
                var msg = 'Registration failed! Please try another username/email'
                // console.error(msg);
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(msg)
                        .hideDelay(4000)
                );
                // $rootScope.error = msg;
            }
        }

        /**
         * @name login
         * @desc Try to log in with email `email` and password `password`
         * @param {string} email The email entered by the user
         * @param {string} password The password entered by the user
         * @returns {Promise}
         * @memberOf crowdjump.authentication.services.Authentication
         */
        function login(email, password) {
            return $http.post('/api/v1/auth/login/', {
                email: email, password: password
            }).then(loginSuccessFn, loginErrorFn);

            /**
             * @name loginSuccessFn
             * @desc Set the authenticated account and redirect to index
             */
            function loginSuccessFn(data, status, headers, config) {
                Authentication.setAuthenticatedAccount(data.data);
                console.error("authenticated? " + Authentication.isAuthenticated());
                Statistics.create().then(createStatisticsSuccessFn, createStatisticsErrorFn);
                window.location = '/';
            }

            function createStatisticsSuccessFn(data, status, headers, config) {
                console.error("succ");

            }

            function createStatisticsErrorFn(data, status, headers, config) {
                console.error("error" + data.error);

            }

            /**
             * @name loginErrorFn
             * @desc Log "Epic failure!" to the console
             */
            function loginErrorFn(data, status, headers, config) {
                var msg = 'Login failed! Email or password is wrong!';
                // console.error(msg);
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(msg)
                        .hideDelay(4000)
                );
                // $rootScope.error = msg;
            }
        }


        /**
         * @name logout
         * @desc Try to log the user out
         * @returns {Promise}
         * @memberOf crowdjump.authentication.services.Authentication
         */
        function logout() {
            return $http.post('/api/v1/auth/logout/')
                .then(logoutSuccessFn, logoutErrorFn);

            /**
             * @name logoutSuccessFn
             * @desc Unauthenticate and redirect to index with page reload
             */
            function logoutSuccessFn(data, status, headers, config) {
                // console.error("success??");
                Authentication.unauthenticate();

                window.location = '/';
            }

            /**
             * @name logoutErrorFn
             * @desc Log "Epic failure!" to the console
             */
            function logoutErrorFn(data, status, headers, config) {
                var msg = 'Logout failed!';
                $mdToast.show(
                    $mdToast.simple()
                        .textContent(msg)
                        .hideDelay(4000)
                );
                // console.error(msg);
                // $rootScope.error = msg;
            }
        }


        /**
         * @name getAuthenticatedAccount
         * @desc Return the currently authenticated account
         * @returns {object|undefined} Account if authenticated, else `undefined`
         * @memberOf crowdjump.authentication.services.Authentication
         */
        function getAuthenticatedAccount() {
            if (!$cookies.getObject("authenticatedAccount")) {
                return;
            }

            return $cookies.getObject("authenticatedAccount");//JSON.parse($cookies.authenticatedAccount);
        }

        /**
         * @name isAuthenticated
         * @desc Check if the current user is authenticated
         * @returns {boolean} True is user is authenticated, else false.
         * @memberOf crowdjump.authentication.services.Authentication
         */
        function isAuthenticated() {
            // console.error("isAuthenticated " + $cookies.getObject("authenticatedAccount"));
            if ($cookies.getObject("authenticatedAccount") != null) {
                return true;
            }
            return false;
        }

        /**
         * @name setAuthenticatedAccount
         * @desc Stringify the account object and store it in a cookie
         * @param {Object} user The account object to be stored
         * @returns {undefined}
         * @memberOf crowdjump.authentication.services.Authentication
         */
        function setAuthenticatedAccount(account) {
            var expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 1);
            $cookies.put("authenticatedAccount", JSON.stringify(account), {'expires': expireDate});
        }

        /**
         * @name unauthenticate
         * @desc Delete the cookie where the user object is stored
         * @returns {undefined}
         * @memberOf crowdjump.authentication.services.Authentication
         */
        function unauthenticate() {
            $cookies.remove("authenticatedAccount");
        }

    }
})();