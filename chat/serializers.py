from rest_framework import serializers
from authentication.serializers import AccountSerializerPrivate
from chat.models import ChatMessage


class ChatMessageSerializer(serializers.ModelSerializer):
    user = AccountSerializerPrivate(read_only=True, required=False)

    class Meta:
        model = ChatMessage

        fields = ('id', 'user', 'message', 'message_html', 'created')

        read_only_fields = ('id', 'created')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(ChatMessage, self).get_validation_exclusions()

        return exclusions + ['user']