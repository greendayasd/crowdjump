(function () {
    'use strict';

    angular
        .module('crowdjump.chat.controllers')
        .controller('ChatController', ChatController);

    ChatController.$inject = ['$scope', 'Authentication', 'Chat'];

    function ChatController($scope, Authentication, Chat) {
        var vm = this;
        $scope.chatMessages = [];
        $scope.unreadMessages = '';
        $scope.messageCounter = 0;
        $scope.unreadMessagesNotZero = true;

        vm.isAuthenticated = Authentication.isAuthenticated();
        // console.error(vm.isAuthenticated || false);
        // vm.cookie = $cookies.getObject('authenticatedAccount');


        var roomName = '123';

        var ws_scheme = 'wss'; //window.location.protocol == "https:" ? "wss" : "ws";

        var port = ':8001';
        if (window.location.host == "localhost:8000") {
            ws_scheme = 'ws';
            port = '';
        }
        var chatSocket = new WebSocket(
            ws_scheme + '://' + window.location.host + port +
            '/ws/chat/' + roomName + '/');

        activate();

        function activate() {
            Chat.newestX(16).then(chatSuccessFn, chatErrorFn);

            function chatSuccessFn(data, status, headers, config) {
                $scope.chatMessages = data.data.results.reverse();
                // console.log($scope.chatMessages);

            }

            function chatErrorFn(data, status, headers, config) {
                console.error(data.error);
            }

            window.setTimeout(function () {
                scrollChat();
            }, 100);

        }

        function scrollChat() {
            document.getElementById('scroll').scrollIntoView();
        }

        $scope.resetUnread = function () {
            $scope.unreadMessages = '';
            $scope.messageCounter = 0;
            $scope.unreadMessagesNotZero = false;
        }
        $scope.test = function () {
            document.getElementById('scroll').scrollIntoView();
        }

        chatSocket.onmessage = function (message) {

            if ($("#no_messages").length) {
                $("#no_messages").remove();
            }

            var data = JSON.parse(message.data);
            var chat = $("#all_messages")
            var date = data.datetime;
            var ele = $('<div [innerHTML]="text" style="background-color: white" title=data.datetime></div>')

            ele.append(
                ' <strong>' + data.username + ': </strong> ')

            ele.append(
                data.message)

            chat.append(ele)
            //$('#all_messages').scrollTop($('#all_messages')[0].scrollHeight);
            $('#all_messages').scrollTop($('#all_messages')[$('#all_messages').length - 1].scrollHeight);

            //notify
            var open = document.querySelector('#sidebar.active');
            if (open == null) {
                $scope.messageCounter += 1;
                $scope.unreadMessages = '' + $scope.messageCounter;
                $scope.$apply(function () {
                    $scope.unreadMessagesNotZero = false;
                });
            }
        };


        chatSocket.onclose = function (e) {
            console.error('Chat socket closed unexpectedly');
        };
        document.querySelector('#chat-message-input').focus();
        document.querySelector('#chat-message-input').onkeyup = function (e) {
            if (e.keyCode === 13) {  // enter, return
                document.querySelector('#chat-message-submit').click();
            }
        };

        document.querySelector('#chat-message-submit').onclick = function (e) {
            var messageInputDom = document.querySelector('#chat-message-input');
            var message = messageInputDom.value;
            var datetime = new Date().format('d-m-Y h:i:s');

            chatSocket.send(JSON.stringify({
                'message': message,
                'datetime': datetime
            }));

            messageInputDom.value = '';
        };
    }
})();