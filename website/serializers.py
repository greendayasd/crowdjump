from rest_framework import serializers
from .models import Idea, Version, GameInfo, WebsiteInfo, Vote
from authentication.models import Account


class UserSerializer(serializers.HyperlinkedModelSerializer):
    ideas = serializers.HyperlinkedIdentityField(view_name='useridea-list', lookup_field='username')

    # votes = serializers.HyperlinkedIdentityField(view_name='vote-list', lookup_field='idea')

    class Meta:
        model = Account
        fields = ('id', 'username', 'ideas',)


class IdeaSerializer(serializers.HyperlinkedModelSerializer):
    user = UserSerializer(required=False)

    # votes = serializers.HyperlinkedIdentityField(view_name='vote-list', lookup_field='idea')

    def get_validation_exclusions(self):
        # Need to exclude `user` since we'll add that later based off the request
        exclusions = super(IdeaSerializer, self).get_validation_exclusions()
        return exclusions + ['user']

    class Meta:
        model = Idea
        fields = '__all__'


class VersionSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Version
        fields = '__all__'


class VoteSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Vote
        fields = '__all__'


class GameInfoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = GameInfo
        fields = '__all__'


class WebsiteInfoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = WebsiteInfo
        fields = '__all__'
