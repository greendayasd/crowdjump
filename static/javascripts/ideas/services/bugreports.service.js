
(function () {
    'use strict';

    angular
        .module('crowdjump.ideas.services')
        .factory('Bugreports', Bugreports);

    Bugreports.$inject = ['$http', 'History'];


    function Bugreports($http, History) {
        var Bugreports = {
            all: all,
            all_fixed:all_fixed,
            create: create,
            get: get,
            deleteBugreport: deleteBugreport,
        };

        return Bugreports;


        function all() {
            return $http.get('/api/v1/bugreports?deleted=false');
        }

        function all_fixed() {
            return $http.get('/api/v1/bugreports?fixed=true');
        }

        function create(content) {
            var result =  $http.post('/api/v1/bugreports/', {
                version: content["version"],
                request_text: content["request_text"],
                description: content["description"]
            });
            return result;
        }

        function get(username) {
            return $http.get('/api/v1/accounts/' + username + '/bugreports/');
        }

        function deleteBugreport(id){
            return $http.patch('/api/v1/bugreports/' + id +'/', {
                deleted: true
            })
        }

    }
})();