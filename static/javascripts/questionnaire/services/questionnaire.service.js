(function () {
        'use strict';

        angular
            .module('crowdjump.questionnaire.services')
            .factory('Questionnaire', Questionnaire);

        Questionnaire.$inject = ['$http', '$cookies'];


        // function config($qProvider) {
        //     $qProvider.errorOnUnhandledRejections(false);
        // };

        function Questionnaire($http, $cookies) {
            var Questionnaire = {
                all_pre: all_pre,
                all_post: all_post,
                increase_surveycount: increase_surveycount,
                cookieasd: cookieasd,
                post_preSite: post_preSite,
            };

            return Questionnaire;


            function all_pre() {
                return $http.get('/api/v1/ideavotes/presurvey');
            }

            function all_post() {
                return $http.get('/api/v1/ideavotes/postsurvey');
            }

            function cookieasd() {
                var res = $cookies.getObject("authenticatedAccount");
                res["survey_status"] = 1;

                $cookies.put("authenticatedAccount", JSON.stringify(res));

            }

            function increase_surveycount(username, newCount) {
                var res = $cookies.getObject("authenticatedAccount");
                res["survey_status"] = newCount;

                $cookies.put("authenticatedAccount", JSON.stringify(res));
                return $http.patch('/api/v1/accounts/' + username + '/', {
                    survey_status: newCount,


                }).then(increaseSuccessFn, registerErrorFn);

                function increaseSuccessFn(data, status, headers, config) {
                }

                function registerErrorFn(data, status, headers, config) {
                    var msg = 'Could not get to next survey'
                    console.log(msg);
                }
            }

            function post_preSite(user_id, site, cont) {
                var survey_id;
                $http.get('/api/v1/presurvey/?user__id=' + user_id + '&limit=1'
                ).then(function (result) {

                    if (result["data"]["count"] > 0) {
                        // console.error("vorhanden");
                        var survey = result["data"]["results"][0];
                        survey_id = survey["id"];
                        // console.log(survey);
                        survey["site" + site] = cont;
                        // console.log(survey);
                        $http.patch('/api/v1/presurvey/' + survey_id + '/', {
                            site0: survey["site0"],
                            site1: survey["site1"],
                            site2: survey["site2"],
                            site3: survey["site3"],
                            site4: survey["site4"],
                        }).then(function (result) {
                            // console.error("bearbeitet");
                            return result;
                        }).catch(function (error) {
                            console.error("Fehler " + JSON.stringify(error));
                        });
                    } else {
                        // console.error("muss neu angelegt werden " + vote);
                        cont == '' ? cont = null : cont;
                        $http.post('/api/v1/presurvey/', {
                            "site0": cont,
                            "site1": null,
                            "site2": null,
                            "site3": null,
                            "site4": null,
                        }).then(function (result) {
                            // console.error("neu angelegt");
                            return result;
                        }).catch(function (error) {
                            console.error("Fehler " + JSON.stringify(error));
                        });
                    }

                }).catch(function (error) {
                    console.error("Could not get PreSurvey  " + JSON.stringify(error));
                });


            }


        }
    }

)();