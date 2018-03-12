/**
 * Authentication
 * @namespace authentication.services
 */
(function () {
    'use strict';

    angular
        .module('crowdjump.authentication.services')
        .factory('Authentication', Authentication);

    Authentication.$inject = ['$cookies', '$rootScope', '$http'];

    /**
     * @namespace Authentication
     * @returns {Factory}
     */
    function Authentication($cookies, $rootScope, $http) {
        /**
         * @name Authentication
         * @desc The Factory to be returned
         */
        var Authentication = {
            getAuthentication: getAuthentication,
            isAuthenticated: isAuthenticated,
            login: login,
            logout:logout,
            register: register,
            setAuthentication: setAuthentication,
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
                email: email
            }).then(registerSuccessFn, registerErrorFn);

            /**
             * @name registerSuccessFn
             * @desc Log the new user in
             */
            function registerSuccessFn(data, status, headers, config) {
                Authentication.login(email, password);
            }

            /**
             * @name registerErrorFn
             * @desc Log "Epic failure!" to the console
             */
            function registerErrorFn(data, status, headers, config) {
                var msg = 'Registration failed! Please try another username/email'
                console.error(msg);
                $rootScope.error = msg;
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
                Authentication.setAuthentication(data.data);
                // console.error("authenticated? " + Authentication.isAuthenticated())
                window.location = '/';
            }

            /**
             * @name loginErrorFn
             * @desc Log "Epic failure!" to the console
             */
            function loginErrorFn(data, status, headers, config) {
                var msg = 'Login failed! Email or password is wrong!';
                console.error(msg);
                $rootScope.error = msg;
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
                Authentication.unauthenticate();

                window.location = '/';
            }

            /**
             * @name logoutErrorFn
             * @desc Log "Epic failure!" to the console
             */
            function logoutErrorFn(data, status, headers, config) {
                var msg = 'Logout failed!';
                console.error(msg);
                $rootScope.error = msg;
            }
        }


        /**
         * @name getAuthentication
         * @desc Return the currently authenticated account
         * @returns {object|undefined} Account if authenticated, else `undefined`
         * @memberOf crowdjump.authentication.services.Authentication
         */
        function getAuthentication() {
            if (!$cookies.getObject("Authentication")) {
                return;
            }

            return $cookies.getObject("Authentication");//JSON.parse($cookies.Authentication);
        }

        /**
         * @name isAuthenticated
         * @desc Check if the current user is authenticated
         * @returns {boolean} True is user is authenticated, else false.
         * @memberOf crowdjump.authentication.services.Authentication
         */
        function isAuthenticated() {
            // console.error("isAuthenticated " + $cookies.getObject("Authentication"));
            if ($cookies.getObject("Authentication") != null){
                return true;
            }
            return false;
        }

        /**
         * @name setAuthentication
         * @desc Stringify the account object and store it in a cookie
         * @param {Object} user The account object to be stored
         * @returns {undefined}
         * @memberOf crowdjump.authentication.services.Authentication
         */
        function setAuthentication(account) {
            $cookies.put("Authentication", JSON.stringify(account));
        }

        /**
         * @name unauthenticate
         * @desc Delete the cookie where the user object is stored
         * @returns {undefined}
         * @memberOf crowdjump.authentication.services.Authentication
         */
        function unauthenticate() {
            $cookies.remove("Authentication");
        }
    }
})();