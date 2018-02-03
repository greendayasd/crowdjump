from rest_framework import serializers
from .models import Version
from authentication.models import Account, GameInfo, WebsiteInfo


class VersionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Version
        fields = ('id', 'label', 'change', 'created_at' 'submitter')
        # read_only_fields = 'created_at'

    # def create(self, validated_data):
    #     return Version.objects.create(**validated_data)
