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
        text_data_json["type"]='idea_broadcast'
        id = text_data_json['id']
        request_text = text_data_json['request_text']
        description = text_data_json['description']
        estimated_time = text_data_json['estimated_time']
        upvotes = text_data_json['upvotes']
        downvotes = text_data_json['downvotes']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            text_data_json
        )

    async def receive_idea(self, idea):
        text_data_json = json.loads(idea)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'idea_broadcast',
                'message': message
            }
        )

    async def receive_vote(self, vote):
        text_data_json = json.loads(vote)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'idea_broadcast',
                'message': message
            }
        )

    async def idea_broadcast(self, event):
        request_text = event['request_text']
        id = event['id']
        version = event['version']
        created_at = event['created_at']
        description = event['description']
        estimated_time = event['estimated_time']
        upvotes = event['upvotes']
        downvotes = event['downvotes']

        # Send message to WebSocket
        await self.send(text_data=json.dumps(event))
