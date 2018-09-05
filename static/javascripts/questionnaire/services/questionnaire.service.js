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
                post_preSite: post_preSite,
                post_postSite: post_postSite,
                get_pre: get_pre,
                get_post: get_post,
            };

            return Questionnaire;


            function all_pre() {
                return $http.get('/api/v1/presurvey/');
            }

            function all_post() {
                return $http.get('/api/v1/postsurvey/');
            }

            function increase_surveycount(username, newCount) {
                var res = $cookies.getObject("authenticatedAccount");
                res["survey_status"] = newCount;

                $cookies.put("authenticatedAccount", JSON.stringify(res));
                // return $http.patch('/api/v1/accounts/' + username + '/', {
                //     survey_status: newCount,
                //
                //
                // }).then(increaseSuccessFn, increaseErrorFn);
                //
                // function increaseSuccessFn(data, status, headers, config) {
                // }
                //
                // function increaseErrorFn(data, status, headers, config) {
                //     var msg = 'Could not get to next survey'
                //     console.log(msg + '\n' + data);
                // }
            }

            function post_preSite(user_id, site, cont, cookie) {
                var survey_id;
                $http.get('/api/v1/presurvey/?user__id=' + user_id + '&limit=1'
                ).then(function (result) {
                    if (result["data"]["count"] > 0) {
                        var survey = result["data"]["results"][0];
                        survey_id = survey["id"];

                        if (site == 0) {
                            Questionnaire.increase_surveycount(cookie["username"], 1);

                            $http.patch('/api/v1/presurvey/' + survey_id + '/', {
                                site0: survey["site0"]
                            }).then(function (result) {
                                window.location.href = '/survey' + 1;
                                return result;
                            }).catch(function (error) {
                                console.log(error);
                            });
                        }
                        if (site == 1) {
                            survey["Age_Combobox"] = cont[0];
                            survey["Gender_Combobox"] = cont[1];
                            survey["HoursPCWeek_Combobox"] = cont[2];
                            survey["VideogamesWeek_Combobox"] = cont[3];
                            survey["ImportantAspect_Checkbox"] = cont[4];
                            survey["ImportantAspectOther_Checkbox"] = cont[5];
                            survey["MostImportantAspect_Radiolist"] = cont[6];
                            survey["MostImportantAspectOther_Radiolist"] = cont[7];
                            survey["PlayPlatformers_7scale"] = cont[8];
                            survey["LikePlatformers_7scale"] = cont[9];
                            survey["LikePlatformersMore_7scale"] = cont[10];
                            survey["EverDesignedVG_bool"] = cont[11];
                            survey["EverDesignedApp_bool"] = cont[12];
                            survey["DesignProcess_bool"] = cont[13];
                            survey["HowInDesignProcess_text"] = cont[14];
                            survey["WatchedTP_bool"] = cont[15];
                            survey["ParticipateTP_bool"] = cont[16];
                            survey["LikeTP_7scale"] = cont[17];
                            survey["HeardPBN_bool"] = cont[18];
                            survey["PlayPBN_bool"] = cont[19];
                            survey["LikePBN_7scale"] = cont[20];
                            survey["IdeaPBN_bool"] = cont[21];

                            Questionnaire.increase_surveycount(cookie["username"], 2);
                            $http.patch('/api/v1/presurvey/' + survey_id + '/', {
                                Age_Combobox: survey["Age_Combobox"],
                                Gender_Combobox: survey["Gender_Combobox"],
                                HoursPCWeek_Combobox: survey["HoursPCWeek_Combobox"],
                                VideogamesWeek_Combobox: survey["VideogamesWeek_Combobox"],
                                ImportantAspect_Checkbox: survey["ImportantAspect_Checkbox"],
                                ImportantAspectOther_Checkbox: survey["ImportantAspectOther_Checkbox"],
                                MostImportantAspect_Radiolist: survey["MostImportantAspect_Radiolist"],
                                MostImportantAspectOther_Radiolist: survey["MostImportantAspectOther_Radiolist"],
                                PlayPlatformers_7scale: survey["PlayPlatformers_7scale"],
                                LikePlatformers_7scale: survey["LikePlatformers_7scale"],
                                LikePlatformersMore_7scale: survey["LikePlatformersMore_7scale"],
                                EverDesignedVG_bool: survey["EverDesignedVG_bool"],
                                EverDesignedApp_bool: survey["EverDesignedApp_bool"],
                                DesignProcess_bool: survey["DesignProcess_bool"],
                                HowInDesignProcess_text: survey["HowInDesignProcess_text"],
                                WatchedTP_bool: survey["WatchedTP_bool"],
                                ParticipateTP_bool: survey["ParticipateTP_bool"],
                                LikeTP_7scale: survey["LikeTP_7scale"],
                                HeardPBN_bool: survey["HeardPBN_bool"],
                                PlayPBN_bool: survey["PlayPBN_bool"],
                                LikePBN_7scale: survey["LikePBN_7scale"],
                                IdeaPBN_bool: survey["IdeaPBN_bool"],
                            }).then(function (result) {
                                window.location.href = '/survey' + 2;
                                return result;
                            }).catch(function (error) {
                                console.log(error);
                            });
                        }
                        if (site == 2) {
                            survey["ABSurvey0"] = cont[0];
                            survey["ABSurvey1"] = cont[1];
                            survey["ABSurvey2"] = cont[2];
                            survey["ABSurvey3"] = cont[3];
                            survey["ABSurvey4"] = cont[4];
                            survey["ABSurvey5"] = cont[5];
                            survey["ABSurvey6"] = cont[6];
                            survey["ABSurvey7"] = cont[7];
                            survey["ABSurvey8"] = cont[8];
                            survey["ABSurvey9"] = cont[9];
                            Questionnaire.increase_surveycount(cookie["username"], 0);
                            $http.patch('/api/v1/presurvey/' + survey_id + '/', {

                                ABSurvey0: survey["ABSurvey0"],
                                ABSurvey1: survey["ABSurvey1"],
                                ABSurvey2: survey["ABSurvey2"],
                                ABSurvey3: survey["ABSurvey3"],
                                ABSurvey4: survey["ABSurvey4"],
                                ABSurvey5: survey["ABSurvey5"],
                                ABSurvey6: survey["ABSurvey6"],
                                ABSurvey7: survey["ABSurvey7"],
                                ABSurvey8: survey["ABSurvey8"],
                                ABSurvey9: survey["ABSurvey9"],
                            }).then(function (result) {
                                window.location.href = '/survey' + 0;
                                return result;
                            }).catch(function (error) {
                                console.log(error);
                            });
                        }
                    } else {
                        // console.log("post");
                        $http.post('/api/v1/presurvey/', {
                            site0: null,
                        }).then(function (result) {
                            return result;
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }

                }).catch(function (error) {
                    console.log(error);
                });


            }

            function post_postSite(user_id, site, cont) {
                var survey_id;
                $http.get('/api/v1/postsurvey/?user__id=' + user_id + '&limit=1'
                ).then(function (result) {

                    if (result["data"]["count"] > 0) {
                        var survey = result["data"]["results"][0];
                        survey_id = survey["id"];

                        if (site == 2) {
                            for (var i = 0; i < cont.length; i++) {
                                var n;
                                i < 10 ? n = '0' + i : n = i + '';
                                survey["GEQ" + n] = cont[i];
                            }
                        }

                        if (site == 3) {
                            for (var i = 0; i < cont.length; i++) {
                                var n;
                                i < 10 ? n = '0' + i : n = i + '';
                                survey["SPGQ" + n] = cont[i];
                            }
                        }
                        if (site == 4) {
                            for (var i = 0; i < cont.length; i++) {
                                var n;
                                i < 10 ? n = '0' + i : n = i + '';
                                survey["KIM" + n] = cont[i];
                            }
                        }
                        if (site == 5) {
                            for (var i = 0; i < cont.length; i++) {
                                var n;
                                i < 10 ? n = '0' + i : n = i + '';
                                survey["SUS" + n] = cont[i];
                            }
                        }
                        if (site == 6) {
                            for (var i = 0; i < cont.length; i++) {
                                var n;
                                i < 10 ? n = '0' + i : n = i + '';
                                survey["General" + n] = cont[i];
                            }
                        }
                        console.log(survey);
                        $http.patch('/api/v1/postsurvey/' + survey_id + '/', {
                            site0: survey["site0"],

                            GEQ00: survey["GEQ00"],
                            GEQ01: survey["GEQ01"],
                            GEQ02: survey["GEQ02"],
                            GEQ03: survey["GEQ03"],
                            GEQ04: survey["GEQ04"],
                            GEQ05: survey["GEQ05"],
                            GEQ06: survey["GEQ06"],
                            GEQ07: survey["GEQ07"],
                            GEQ08: survey["GEQ08"],
                            GEQ09: survey["GEQ09"],
                            GEQ10: survey["GEQ10"],
                            GEQ11: survey["GEQ11"],
                            GEQ12: survey["GEQ12"],
                            GEQ13: survey["GEQ13"],
                            GEQ14: survey["GEQ14"],
                            GEQ15: survey["GEQ15"],
                            GEQ16: survey["GEQ16"],
                            GEQ17: survey["GEQ17"],
                            GEQ18: survey["GEQ18"],
                            GEQ19: survey["GEQ19"],
                            GEQ20: survey["GEQ20"],
                            GEQ21: survey["GEQ21"],
                            GEQ22: survey["GEQ22"],
                            GEQ23: survey["GEQ23"],
                            GEQ24: survey["GEQ24"],
                            GEQ25: survey["GEQ25"],
                            GEQ26: survey["GEQ26"],
                            GEQ27: survey["GEQ27"],
                            GEQ28: survey["GEQ28"],
                            GEQ29: survey["GEQ29"],
                            GEQ30: survey["GEQ30"],
                            GEQ31: survey["GEQ31"],
                            GEQ32: survey["GEQ32"],

                            SPGQ00: survey["SPGQ00"],
                            SPGQ01: survey["SPGQ01"],
                            SPGQ02: survey["SPGQ02"],
                            SPGQ03: survey["SPGQ03"],
                            SPGQ04: survey["SPGQ04"],
                            SPGQ05: survey["SPGQ05"],
                            SPGQ06: survey["SPGQ06"],
                            SPGQ07: survey["SPGQ07"],
                            SPGQ08: survey["SPGQ08"],
                            SPGQ09: survey["SPGQ09"],
                            SPGQ10: survey["SPGQ10"],
                            SPGQ11: survey["SPGQ11"],
                            SPGQ12: survey["SPGQ12"],
                            SPGQ13: survey["SPGQ13"],
                            SPGQ14: survey["SPGQ14"],
                            SPGQ15: survey["SPGQ15"],
                            SPGQ16: survey["SPGQ16"],
                            SPGQ17: survey["SPGQ17"],
                            SPGQ18: survey["SPGQ18"],
                            SPGQ19: survey["SPGQ19"],
                            SPGQ20: survey["SPGQ20"],

                            KIM00: survey["KIM00"],
                            KIM01: survey["KIM01"],
                            KIM02: survey["KIM02"],
                            KIM03: survey["KIM03"],
                            KIM04: survey["KIM04"],
                            KIM05: survey["KIM05"],
                            KIM06: survey["KIM06"],
                            KIM07: survey["KIM07"],
                            KIM08: survey["KIM08"],
                            KIM09: survey["KIM09"],
                            KIM10: survey["KIM10"],
                            KIM11: survey["KIM11"],

                            SUS00: survey["SUS00"],
                            SUS01: survey["SUS01"],
                            SUS02: survey["SUS02"],
                            SUS03: survey["SUS03"],
                            SUS04: survey["SUS04"],
                            SUS05: survey["SUS05"],
                            SUS06: survey["SUS06"],
                            SUS07: survey["SUS07"],
                            SUS08: survey["SUS08"],
                            SUS09: survey["SUS09"],

                            General00: survey["General00"],
                            General01: survey["General01"],
                            General02: survey["General02"],
                            General03: survey["General03"],
                            General04: survey["General04"],
                            General05: survey["General05"],
                            General06: survey["General06"],
                            General07: survey["General07"],
                            General08: survey["General08"],
                            General09: survey["General09"],
                            General10: survey["General10"],
                        }).then(function (result) {
                            return result;
                        }).catch(function (error) {
                        });
                    } else {

                        $http.post('/api/v1/postsurvey/', {
                            "site0": null,
                        }).then(function (result) {
                            return result;
                        }).catch(function (error) {
                        });
                    }

                }).catch(function (error) {
                    console.error("Could not get PostSurvey  " + JSON.stringify(error));
                });


            }

            function get_pre(user_id) {
                var res = $http.get('/api/v1/presurvey/?user__id=' + user_id + '&limit=1');
                return res["results"];
            }

            function get_post(user_id) {
                var res = $http.get('/api/v1/postsurvey/?user__id=' + user_id + '&limit=1');
                return res["results"];
            }


        }
    }

)();