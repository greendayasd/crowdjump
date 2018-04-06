from rest_framework import serializers

from authentication.serializers import AccountSerializer
from website.serializers import VersionSerializer
from ideas.models import Idea, CommentVote, IdeaVote, Comment
from authentication.models import GameInfo, WebsiteInfo


class IdeaSerializer(serializers.ModelSerializer):
    user = AccountSerializer(read_only=True, required=False)
    # votes = serializers.HyperlinkedIdentityField('vote', lookup_field='username')

    version = VersionSerializer(read_only=True, required=False)

    class Meta:
        model = Idea

        fields = ('id', 'user', 'version', 'request_text', 'description',
                  'created_at', 'updated_at', 'estimated_time', 'admin_comment',
                  'feasible', 'implemented', 'deleted',
                  'upvotes', 'downvotes')

        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(IdeaSerializer, self).get_validation_exclusions()

        return exclusions + ['user']


class GameInfoSerializer(serializers.HyperlinkedModelSerializer):
    user = AccountSerializer(read_only=True, required=False)
    version = VersionSerializer(read_only=True, required=False)

    class Meta:
        model = GameInfo
        fields = (
        'id', 'user', 'version', 'rounds_started', 'rounds_won', 'enemies_killed', 'coins_collected', 'highscore',
        'time_spent_game')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(GameInfoSerializer, self).get_validation_exclusions()

        return exclusions + ['user']


class CommentSerializer(serializers.ModelSerializer):
    user = AccountSerializer(read_only=True, required=False)
    idea = IdeaSerializer(read_only=True, required=False)

    class Meta:
        model = Comment

        fields = ('id', 'user', 'idea', 'text',
                  'created_at', 'updated_at',
                  'upvotes', 'downvotes')

        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(CommentSerializer, self).get_validation_exclusions()

        return exclusions + ['user'] + ['idea']


class IdeaVoteSerializer(serializers.ModelSerializer):
    user = AccountSerializer(read_only=True, required=False)
    idea = IdeaSerializer(read_only=False, required=False)

    vote = serializers.IntegerField()

    class Meta:
        model = IdeaVote

        fields = ('id', 'user', 'idea', 'vote')

    def create(self, validated_data):
        self.idea.vote(self.idea, self.vote)

    def update(self, instance, validated_data):
        old_v = self.vote
        new_v = instance.vote
        self.idea.update_vote(self, old_v, new_v)


class CommentVoteSerializer(serializers.ModelSerializer):
    user = AccountSerializer(read_only=True, required=False)
    comment = CommentSerializer(read_only=True, required=False)

    class Meta:
        model = CommentVote

        fields = ('id', 'user', 'comment', 'vote')


class WebsiteInfoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = WebsiteInfo
        fields = '__all__'
