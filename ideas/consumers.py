from channels.generic.websocket import AsyncWebsocketConsumer
import json


class IdeaConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_group_name = 'ideas'

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

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            text_data_json
        )

    async def idea_broadcast(self, event):
        await self.send(text_data=json.dumps(event))

    async def comment_broadcast(self, event):
        await self.send(text_data=json.dumps(event))


class VoteConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_group_name = 'votes'

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

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            text_data_json
        )

    async def vote_broadcast(self, event):
        await self.send(text_data=json.dumps(event))


class BugreportConsumer(AsyncWebsocketConsumer):

    async def connect(self):
        self.room_group_name = 'bugreports'

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

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            text_data_json
        )

    async def bugreport_broadcast(self, event):
        await self.send(text_data=json.dumps(event))
