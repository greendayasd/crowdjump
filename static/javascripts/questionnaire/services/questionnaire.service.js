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
                all_forms: all_forms,
                all_pre: all_pre,
                all_post: all_post,
                increase_surveycount: increase_surveycount,
                post_Form: post_Form,
                post_preSite: post_preSite,
                post_postSite: post_postSite,
                get_form: get_form,
                get_pre: get_pre,
                get_post: get_post,
            };

            return Questionnaire;


            function all_forms() {
                return $http.get('/api/v1/forms/');
            }

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
                return $http.patch('/api/v1/accounts/' + username + '/', {
                    survey_status: newCount


                }).then(increaseSuccessFn, increaseErrorFn);

                function increaseSuccessFn(data, status, headers, config) {
                }

                function increaseErrorFn(data, status, headers, config) {
                    var msg = 'Could not get to next survey'
                    // console.log(msg + '\n' + data);
                }
            }

            function post_Form(site, cont) {
                var formID;
                var csrftoken = getCookie("csrftoken");
                $http.get('/api/v1/registrationForm/?csrf=' + csrftoken + '&limit=1'
                ).then(function (result) {
                    if (result["data"]["count"] > 0) {
                        var form = result["data"]["results"][0];

                        if (site == 0) {

                        }
                        if (site == 1) {
                            formID = form["id"];
                            form["email"] = cont[0];
                            form["alreadyParticipated_bool"] = cont[1];
                            form["interestedInDevelopment_bool"] = cont[2];
                            form["influenceOverDevelopment_bool"] = cont[3];
                            $http.patch('/api/v1/registrationForm/' + formID + '/', {
                                email: form["email"],
                                alreadyParticipated_bool: form["alreadyParticipated_bool"],
                                interestedInDevelopment_bool: form["interestedInDevelopment_bool"],
                                influenceOverDevelopment_bool: form["influenceOverDevelopment_bool"]

                            }).then(function (result) {
                                setCookie("survey_status", 101);
                                window.location.href = '/registrationFormFinished';
                                return result;
                            }).catch(function (error) {
                                alert("Please use a valid email address!");

                                console.log(error);
                                return "failure";
                            });

                        }

                    } else {
                        // console.log(csrftoken);
                        $http.post('/api/v1/registrationForm/', {
                            csrf: csrftoken
                        }).then(function (result) {
                            setCookie("survey_status", 100);
                            window.location.href = '/registrationFormQ';
                            return result;
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }

                }).catch(function (error) {
                    $http.post('/api/v1/registrationForm/', {
                        csrf: csrftoken,
                    }).then(function (result) {
                        window.location.href = '/registrationFormFinished';
                        return result;
                    }).catch(function (error) {
                        console.log(error);
                    });
                });


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
                            survey["Job_text"] = cont[22];

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
                                Job: survey["Job_text"],
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
                            Questionnaire.increase_surveycount(cookie["username"], 3);
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
                                window.location.href = '/surveyPreFinished';
                                return result;
                            }).catch(function (error) {
                                console.log(error);
                            });
                        }
                    } else {
                        Questionnaire.increase_surveycount(cookie["username"], 1);
                        // console.log("post");
                        $http.post('/api/v1/presurvey/', {
                            site0: null,
                        }).then(function (result) {
                            window.location.href = '/survey' + 1;
                            return result;
                        }).catch(function (error) {
                            console.log(error);
                        });
                    }

                }).catch(function (error) {
                    $http.post('/api/v1/presurvey/', {
                        site0: null,
                    }).then(function (result) {
                        window.location.href = '/survey' + 1;
                        return result;
                    }).catch(function (error) {
                        console.log(error);
                    });
                });


            }

            function post_postSite(user_id, site, cont, cookie) {
                var survey_id;
                $http.get('/api/v1/postsurvey/?user__id=' + user_id + '&limit=1'
                ).then(function (result) {

                    if (result["data"]["count"] > 0) {
                        var survey = result["data"]["results"][0];
                        survey_id = survey["id"];

                        if (site == 0) {
                            Questionnaire.increase_surveycount(cookie["username"], 7);

                            $http.patch('/api/v1/presurvey/' + survey_id + '/', {
                                site0: survey["site0"]
                            }).then(function (result) {
                                window.location.href = '/postsurvey' + 3;
                                return result;
                            }).catch(function (error) {
                                console.log(error);
                            });
                        }

                        if (site == 3) {
                            for (var i = 0; i < cont.length; i++) {
                                var n;
                                i < 10 ? n = '0' + i : n = i + '';
                                survey["GAM" + n] = cont[i];
                            }
                            $http.patch('/api/v1/postsurvey/' + survey_id + '/', {

                                GAM00: survey["GAM00"],
                                GAM01: survey["GAM01"],
                                GAM02: survey["GAM02"],
                                GAM03: survey["GAM03"],
                                GAM04: survey["GAM04"],
                                GAM05: survey["GAM05"],
                                GAM06: survey["GAM06"],
                                GAM07: survey["GAM07"],
                                GAM08: survey["GAM08"],
                                GAM09: survey["GAM09"],
                                GAM10: survey["GAM10"],
                                GAM11: survey["GAM11"],
                                GAM12: survey["GAM12"],
                                GAM13: survey["GAM13"],
                                GAM14: survey["GAM14"],
                                GAM15: survey["GAM15"],
                                GAM16: survey["GAM16"],
                                GAM17: survey["GAM17"],
                                GAM18: survey["GAM18"],
                                GAM19: survey["GAM19"],
                                GAM20: survey["GAM20"],
                                GAM21: survey["GAM21"],
                                GAM22: survey["GAM22"],
                                GAM23: survey["GAM23"],
                                GAM24: survey["GAM24"],
                                GAM25: survey["GAM25"],
                                GAM26: survey["GAM26"],
                            }).then(function (result) {
                                Questionnaire.increase_surveycount(cookie["username"], 8);
                                window.location.href = '/postsurvey' + 4;
                                return result;
                            }).catch(function (error) {
                            });
                        }
                        if (site == 4) {
                            for (var i = 0; i < cont.length; i++) {
                                var n;
                                i < 10 ? n = '0' + i : n = i + '';
                                survey["IMI" + n] = cont[i];
                            }
                            $http.patch('/api/v1/postsurvey/' + survey_id + '/', {
                                IMI00: survey["IMI00"],
                                IMI01: survey["IMI01"],
                                IMI02: survey["IMI02"],
                                IMI03: survey["IMI03"],
                                IMI04: survey["IMI04"],
                                IMI05: survey["IMI05"],
                                IMI06: survey["IMI06"],
                                IMI07: survey["IMI07"],
                                IMI08: survey["IMI08"],
                                IMI09: survey["IMI09"],
                                IMI10: survey["IMI10"],
                                IMI11: survey["IMI11"],
                                IMI12: survey["IMI12"],
                                IMI13: survey["IMI13"],
                                IMI14: survey["IMI14"],
                                IMI15: survey["IMI15"],
                                IMI16: survey["IMI16"],
                                IMI17: survey["IMI17"],
                                IMI18: survey["IMI18"],
                                IMI19: survey["IMI19"],
                                IMI20: survey["IMI20"],
                                IMI21: survey["IMI21"],
                                IMI22: survey["IMI22"],
                                IMI23: survey["IMI23"],
                                IMI24: survey["IMI24"],
                                IMI25: survey["IMI25"]
                            }).then(function (result) {
                                Questionnaire.increase_surveycount(cookie["username"], 9);
                                window.location.href = '/postsurvey' + 5;
                                return result;
                            }).catch(function (error) {
                            });
                        }
                        if (site == 5) {
                            for (var i = 0; i < cont.length; i++) {
                                var n;
                                i < 10 ? n = '0' + i : n = i + '';
                                survey["SUS" + n] = cont[i];
                            }
                            $http.patch('/api/v1/postsurvey/' + survey_id + '/', {
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
                            }).then(function (result) {
                                Questionnaire.increase_surveycount(cookie["username"], 10);
                                window.location.href = '/postsurvey' + 6;
                                return result;
                            }).catch(function (error) {
                            });
                        }
                        if (site == 6) {
                            for (var i = 0; i < cont.length; i++) {
                                var n;
                                i < 10 ? n = '0' + i : n = i + '';
                                survey["General" + n] = cont[i];
                            }
                            $http.patch('/api/v1/postsurvey/' + survey_id + '/', {
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
                                General11: survey["General11"],
                                General12: survey["General12"],
                                General13: survey["General13"],
                                General14: survey["General14"],
                                General15: survey["General15"],
                                General16: survey["General16"],
                            }).then(function (result) {
                                Questionnaire.increase_surveycount(cookie["username"], 11);
                                window.location.href = '/surveyPostFinished';
                                return result;
                            }).catch(function (error) {
                            });
                        }

                    } else {

                        $http.post('/api/v1/postsurvey/', {
                            "site0": null
                        }).then(function (result) {
                            Questionnaire.increase_surveycount(cookie["username"], 7);
                            window.location.href = '/postsurvey3';
                            return result;
                        }).catch(function (error) {
                        });
                    }

                }).catch(function (error) {
                    $http.post('/api/v1/postsurvey/', {
                        site0: null,
                    }).then(function (result) {
                        window.location.href = '/postsurvey' + 3;
                        return result;
                    }).catch(function (error) {
                        console.log(error);
                    });
                });


            }

            function get_form(email) {
                var res = $http.get('/api/v1/registrationForm/?email=' + email + '&limit=1');
                return res["results"];
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