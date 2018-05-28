(function () {
        'use strict';

        angular
            .module('crowdjump.questionnaire.services')
            .factory('Questionnaire', Questionnaire);

        Questionnaire.$inject = ['$http'];


        // function config($qProvider) {
        //     $qProvider.errorOnUnhandledRejections(false);
        // };

        function Questionnaire($http) {
            var Questionnaire = {
                all_idea: all_idea,
                increase_surveycount: increase_surveycount,
            };

            return Questionnaire;


            function all_idea(idea_id) {
                return $http.get('/api/v1/ideavotes/?idea=' + idea_id);
            }

            function increase_surveycount(username, newCount) {
                return $http.patch('/api/v1/accounts/'+username + '/', {
                    survey_status: newCount,


                }).then(increaseSuccessFn, registerErrorFn);

                function increaseSuccessFn(data, status, headers, config) {
                }

                function registerErrorFn(data, status, headers, config) {
                    var msg = 'Could not get to next survey'
                    console.log(msg);
                }
            }


        }
    }

)();