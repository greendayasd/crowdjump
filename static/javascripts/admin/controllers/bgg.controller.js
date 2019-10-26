(function () {
        'use strict';

        angular
            .module('crowdjump.admin.controllers')
            .controller('BggController', BggController);

        BggController.$inject = ['$scope', 'Authentication'];

        function BggController($scope, Authentication) {

            var vm = this;
            vm.isAuthenticated = Authentication.isAuthenticated();
            vm.cookie = Authentication.getAuthenticatedAccount();
            vm.url = window.location.pathname;
            $scope.gamesearch = "";

            $scope.showResult = function (){
                log($scope.gamesearch);
                var parser, xmlDoc, xmlhttp;
                if ($scope.gamesearch.length < 3) {
                    document.getElementById("livesearch").innerHTML = "";
                    document.getElementById("livesearch").style.border = "0px";
                    return;
                }
                if (window.XMLHttpRequest) {
                    // code for IE7+, Firefox, Chrome, Opera, Safari
                    xmlhttp = new XMLHttpRequest();
                } else {  // code for IE6, IE5
                    xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                }
                xmlhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        document.getElementById("livesearch").innerHTML = this.responseText;

                        xmlDoc = parser.parseFromString(this.responseText, "text/xml");
                        console.log(xmlDoc);
                        document.getElementById("livesearch").innerHTML = "";
                        for (var i = 0; i < 10; i++) {
                            document.getElementById("livesearch").innerHTML += "<br>" + xmlDoc.getElementsByTagName("name")[i].getAttribute('value');
                        }
                        document.getElementById("livesearch").style.border = "1px solid #A5ACB2";
                    }
                }
                xmlhttp.open("GET", "https://www.boardgamegeek.com/xmlapi2/search?query=" + $scope.gamesearch + "&showcount=10", true);
                xmlhttp.send();

                parser = new DOMParser();
            }
        }

    }

)();