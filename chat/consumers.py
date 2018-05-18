from channels.generic.websocket import AsyncWebsocketConsumer
import json,re
from chat.models import ChatMessage


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        self.user = self.scope["user"]
        self.username = self.user.username;

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        original_message=message
        datetime = text_data_json['datetime']
        username = self.scope["user"].username

        # username = text_data_json['username']

        if True:
            urlRegex = re.compile(
            u'(?isu)(\\b(?:https?://|www\\d{0,3}[.]|[a-z0-9.\\-]+[.][a-z]{2,4}/)[^\\s()<'
            u'>\\[\\]]+[^\\s`!()\\[\\]{};:\'".,<>?\xab\xbb\u201c\u201d\u2018\u2019])'
            )

            processed_urls = list()
            for obj in urlRegex.finditer(message):
                old_url = obj.group(0)
                if old_url in processed_urls:
                    continue
                processed_urls.append(old_url)
                new_url = old_url
                if not old_url.startswith(('http://', 'https://')):
                    new_url = 'http://' + new_url
                new_url = '<a href="' + new_url + '">' + new_url + "</a>"
                message = message.replace(old_url, new_url)

        m = ChatMessage(user=self.scope["user"], message=original_message, message_html=message)
        m.save()


        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'datetime': datetime,
                'username': username
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']
        datetime = event['datetime']
        username = event['username']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'datetime': datetime,
            'username': username
        })

)