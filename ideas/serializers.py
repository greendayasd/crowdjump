from rest_framework import serializers

from authentication.serializers import AccountSerializerPrivate, AccountSerializer
from website.serializers import VersionSerializer
from ideas.models import Idea, CommentVote, IdeaVote, Comment
from authentication.models import GameInfo, WebsiteInfo


class IdeaSerializer(serializers.ModelSerializer):
    user = AccountSerializerPrivate(read_only=True, required=False)
    # votes = serializers.HyperlinkedIdentityField('vote', lookup_field='username')

    version = VersionSerializer(read_only=True, required=False)

    class Meta:
        model = Idea

        fields = ('id', 'user', 'version', 'request_text', 'description',
                  'created_at', 'updated_at', 'estimated_time', 'admin_comment',
                  'feasible', 'implemented', 'deleted', 'newest_comment',
                  'upvotes', 'downvotes', 'currently_implemented')

        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(IdeaSerializer, self).get_validation_exclusions()

        return exclusions + ['user']


class IdeaVotingPermissionSerializer(serializers.ModelSerializer):
    user = AccountSerializerPrivate(read_only=True, required=False)
    # votes = serializers.HyperlinkedIdentityField('vote', lookup_field='username')

    version = VersionSerializer(read_only=True, required=False)

    class Meta:
        model = Idea

        fields = ('id', 'user', 'version', 'upvotes', 'downvotes', 'created_at', 'updated_at', 'deleted',)
        read_only_fields = ('id', 'user', 'version', 'created_at', 'updated_at', 'deleted')


    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(IdeaSerializer, self).get_validation_exclusions()

        return exclusions + ['user']
        return exclusions + ['user']


class IdeaNewestCommentPermissionSerializer(serializers.ModelSerializer):
    user = AccountSerializerPrivate(read_only=True, required=False)
    # votes = serializers.HyperlinkedIdentityField('vote', lookup_field='username')

    version = VersionSerializer(read_only=True, required=False)

    class Meta:
        model = Idea

        fields = ('id', 'user', 'version', 'newest_comment', 'created_at', 'updated_at', 'deleted',)
        read_only_fields = ('id', 'user', 'version', 'created_at', 'updated_at', 'deleted')


    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(IdeaSerializer, self).get_validation_exclusions()

        return exclusions + ['user']


class GameInfoSerializer(serializers.HyperlinkedModelSerializer):
    user = AccountSerializerPrivate(read_only=True, required=False)
    version = VersionSerializer(read_only=True, required=False)

    class Meta:
        model = GameInfo
        fields = (
            'id', 'user', 'version', 'rounds_started', 'rounds_won', 'enemies_killed', 'coins_collected', 'highscore',
            'jumps', 'deaths', 'restarts', 'movement_inputs', 'time_spent_game')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(GameInfoSerializer, self).get_validation_exclusions()

        return exclusions + ['user']


class CommentSerializer(serializers.ModelSerializer):
    user = AccountSerializerPrivate(read_only=True, required=False)
    # idea = IdeaSerializer(read_only=True)#(read_only=True, required=False)

    class Meta:
        model = Comment

        fields = ('id', 'user','idea', 'text',
                  'created_at', 'updated_at','status',
                  'upvotes', 'downvotes', 'deleted')

        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(CommentSerializer, self).get_validation_exclusions()

        return exclusions + ['user']


class IdeaVoteSerializer(serializers.ModelSerializer):
    user = AccountSerializerPrivate(read_only=True, required=False)
    # idea = IdeaSerializer(read_only=False, required=False)

    # vote = serializers.IntegerField()

    class Meta:
        model = IdeaVote

        fields = ('id', 'user', 'idea', 'vote', 'multiplier', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    # def create(self, validated_data):
    #     self.idea.vote(self.idea, self.vote)
    #
    # def update(self, instance, validated_data):
    #     old_v = self.vote
    #     new_v = instance.vote
    #     self.idea.update_vote(self, old_v, new_v)

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(IdeaVoteSerializer, self).get_validation_exclusions()

        return exclusions + ['user']


class CommentVoteSerializer(serializers.ModelSerializer):
    user = AccountSerializerPrivate(read_only=True, required=False)
    comment = CommentSerializer(read_only=True, required=False)

    class Meta:
        model = CommentVote

        fields = ('id', 'user', 'comment', 'vote', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at')

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(CommentVoteSerializer, self).get_validation_exclusions()

        return exclusions + ['user']


class WebsiteInfoSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = WebsiteInfo
        fields = '__all__'
