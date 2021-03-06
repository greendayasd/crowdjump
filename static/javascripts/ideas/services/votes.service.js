(function () {
        'use strict';

        angular
            .module('crowdjump.ideas.services')
            .factory('Votes', Votes);

        Votes.$inject = ['$http', 'History'];


        // function config($qProvider) {
        //     $qProvider.errorOnUnhandledRejections(false);
        // };

        function Votes($http, History) {
            var Votes = {
                all: all,
                all_idea: all_idea,
                all_user: all_user,
                vote: vote,
                upvote: upvote,
                downvote: downvote,
                undo_upvote: undo_upvote,
                undo_downvote: undo_downvote,
                down_to_up: down_to_up,
                up_to_down: up_to_down,
                correct_votes: correct_votes,
                calculate_vote_power: calculate_vote_power,
                refresh_vote_power: refresh_vote_power,
            };

            return Votes;

            function all() {
                //exlude 0 vote
                return $http.get('/api/v1/ideavotes/?vote!=0');
            }

            function all_idea(idea_id) {
                return $http.get('/api/v1/ideavotes/?idea=' + idea_id);
            }

            function all_user(user_id) {
                //exlude 0 vote
                return $http.get('/api/v1/ideavotes/?user__id=' + user_id + '&vote!=0');
            }

            function vote(idea_id, user_id, vote) {
                var data = {
                    "userid": user_id,
                    "ideaid": idea_id,
                    "vote": vote
                };

                return $.ajax({
                    url: '/vote/',
                    data: data,
                    success: function (data) {
                        // return data;
                    },
                    error: function (data) {
                        console.log("error: " + data)
                    }
                });

            }

            function vote_alt(idea_id, user_id, vote) {
                var data = {
                    "userid": user_id,
                    "ideaid": idea_id,
                    "vote": vote
                };

                $.ajax({
                    url: '/vote/',
                    data: data,
                    success: function (data) {
                        console.log(data);
                        return data;
                    },
                    error: function (data) {
                        console.log("error: " + data)
                    }
                });

                //alt
                // var vote_id;
                //
                // $http.get('/api/v1/ideavotes/?user__id=' + user_id + '&idea=' + idea_id + '&limit=1'
                // ).then(function (result) {
                //
                //     if (result["data"]["count"] > 0) {
                //         // console.error("vorhanden");
                //         vote_id = result["data"]["results"][0]["id"];
                //         $http.patch('/api/v1/ideavotes/' + vote_id + '/', {
                //             "idea": idea_id,
                //             "vote": vote,
                //             "multiplier": multiplier
                //         }).then(function (result) {
                //             // console.error("bearbeitet");
                //             return result;
                //         }).catch(function (error) {
                //             console.error("Fehler " + JSON.stringify(error));
                //         });
                //     } else {
                //         // console.error("muss neu angelegt werden " + vote);
                //         $http.post('/api/v1/ideavotes/', {
                //             "idea": idea_id,
                //             "vote": vote,
                //             "multiplier": multiplier
                //         }).then(function (result) {
                //             // console.error("neu angelegt");
                //             return result;
                //         }).catch(function (error) {
                //             console.error("Fehler " + JSON.stringify(error));
                //         });
                //     }
                //
                // }).catch(function (error) {
                //     console.error("Could not get ideavotes  " + JSON.stringify(error));
                // });

            }

            function correct_votes(idea_id, upvotes, downvotes, upvote, downvote) {
                return $http.patch('/api/v1/ideasvoting/' + idea_id + '/', {
                    upvotes: upvotes + upvote,
                    downvotes: downvotes + downvote,
                }).then(function (result) {
                    // console.error("new Ideavoting");

                    var content = {
                        "upvotes": upvotes + upvote,
                        "downvotes": downvotes + downvote,
                        "type": "vote_broadcast"
                    };
                    // broadcast_vote(content);
                    return result;
                }).catch(function (error) {
                    console.error("Error in correct_votes " + JSON.stringify(error));
                });

            }

            function upvote(idea_id, user_id, vote) {
                // console.error("vote: " + vote);
                return this.vote(idea_id, user_id, vote);
                // console.log(result);
                // return result;

                // this.correct_votes(idea_id, upvotes, downvotes, vote_worth, 0);
            }

            function downvote(idea_id, user_id, vote) {

                return this.vote(idea_id, user_id, -vote);

                // this.correct_votes(idea_id, upvotes, downvotes, 0, vote_worth);
            }


            function undo_upvote(idea_id, user_id, vote) {
                return this.vote(idea_id, user_id, 0);
                // console.log(result);
                // return result;

                // this.correct_votes(idea_id, upvotes, downvotes, -vote_worth, 0);
            }

            function undo_downvote(idea_id, user_id, vote) {

                return this.vote(idea_id, user_id, 0);

                // this.correct_votes(idea_id, upvotes, downvotes, 0, -vote_worth);
            }


            function down_to_up(idea_id, user_id, vote) {
                return this.vote(idea_id, user_id, vote);

                // this.correct_votes(idea_id, upvotes, downvotes, vote_worth, -vote_worth);

            }

            function up_to_down(idea_id, user_id, vote) {
                return this.vote(idea_id, user_id, -vote);

                // this.correct_votes(idea_id, upvotes, downvotes, -vote_worth, vote_worth);

            }

            function calculate_vote_power(username) {
                $http.get('/api/v1/accounts/' + username + '/');
            }


            function refresh_vote_power(username) {
                // return $http.get('/api/v1/ideavotes/?idea=' + idea_id);
            }

        }
    }

)();