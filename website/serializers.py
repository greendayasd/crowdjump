from rest_framework import serializers
from .models import Version
from authentication.serializers import AccountSerializerPrivate
from authentication.models import Account, GameInfo, WebsiteInfo


class VersionSerializer(serializers.ModelSerializer):
    submitter = AccountSerializerPrivate(read_only=True, required=False)

    class Meta:
        model = Version
        fields = ('id', 'label', 'change', 'submitter', 'features_game', 'features_design', 'features_selection',
                  'features_website', 'vote_weight', 'created_at', 'idea_nr')
        # read_only_fields = ()

    def get_validation_exclusions(self, *args, **kwargs):
        exclusions = super(VersionSerializer, self).get_validation_exclusions()

        return exclusions + ['submitter']

    # def create(self, validated_data):
    #     return Version.objects.create(**validated_data)
