/**
 * Authentication
 * @namespace authentication.services
 */
(function () {
    'use strict';

    angular
        .module('crowdjump.authentication.services')
        .factory('Authentication', Authentication);

    Authentication.$inject = ['$cookies', 'History', '$rootScope', '$http', '$mdToast', 'Statistics'];

    /**
     * @namespace Authentication
     * @returns {Factory}
     */
    function Authentication($cookies, History, $rootScope, $http, $mdToast, Statistics) {
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
            increase_versionlabel: increase_versionlabel,
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

            function registerSuccessFn(data, status, headers, config) {
                /**
                 * Bei Registrierung Statistik für neuste Version anlegen
                 */
                Authentication.login(email, password, true);
            }

            function registerErrorFn(data, status, headers, config) {
                var msg = 'Registration failed! Please try another username/email'
                alert(msg);
                toast(msg);
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
        function login(email, password, firstlogin) {
            return $http.post('/api/v1/auth/login/', {
                email: email, password: password
            }).then(loginSuccessFn, loginErrorFn);

            /**
             * @name loginSuccessFn
             * @desc Set the authenticated account and redirect to index
             */
            function loginSuccessFn(data, status, headers, config) {
                var cookie = Authentication.setAuthenticatedAccount(data.data);
                if (firstlogin || cookie["versionlabel"] != versionlabel) {
                    increase_versionlabel(cookie["username"], true);
                    window.location = '/';
                    setSessionIdentifier();
                    // Statistics.create().then(createStatisticsSuccessFn, createStatisticsErrorFn);
                } else {
                    window.location = '/';
                    setSessionIdentifier();

                }
            }

            function createStatisticsSuccessFn(data, status, headers, config) {
                window.location = '/';
                setSessionIdentifier();

            }

            function createStatisticsErrorFn(data, status, headers, config) {
                console.error("error " + data.error + ' ' + status);
                window.location = '/';
                setSessionIdentifier();

            }

            function loginErrorFn(data, status, headers, config) {
                var msg = 'Login failed! Email or password is wrong!';
                alert(msg);
                toast(msg);
            }
        }

        //Version, in welcher sich angemeldet wurde
        function increase_versionlabel(username, cookie_increase) {
            var data = [];
            $.ajax({
                url: '/createGamedata/',
                data: data,
                success: function (data) {
                    if (cookie_increase) {
                        var res = $cookies.getObject("authenticatedAccount");
                        res["versionlabel"] = versionlabel;
                        window.location.href = '/game';
                    }
                },
                error: function (data) {
                    log("error versionlabel", JSON.stringify(data));
                }
            });
        }

        function logout() {
            return $http.post('/api/v1/auth/logout/')
                .then(logoutSuccessFn, logoutErrorFn);

            /**
             * @name logoutSuccessFn
             * @desc Unauthenticate and redirect to index with page reload
             */
            function logoutSuccessFn(data, status, headers, config) {
                Authentication.unauthenticate();
                deleteCookie("authenticatedAccount");
                window.location = '/';
            }

            function logoutErrorFn(data, status, headers, config) {
                var msg = 'Logout failed!';
                // $route.reload();
                deleteCookie("authenticatedAccount");
                window.location = '/';
                // toast(msg);
            }
        }

        function getAuthenticatedAccount() {
            if (!$cookies.getObject("authenticatedAccount")) {
                return;
            }

            return $cookies.getObject("authenticatedAccount");//JSON.parse($cookies.authenticatedAccount);
        }

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
            expireDate.setDate(expireDate.getDate() + 365);
            $cookies.put("authenticatedAccount", JSON.stringify(account), {'expires': expireDate});
            return $cookies.getObject("authenticatedAccount");
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


        function toast(msg) {
            var toast = $mdToast.simple().textContent(msg)
                .parent($("#toast-container"));
            $mdToast.show(toast);
        }
    }
})();