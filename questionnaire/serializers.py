from rest_framework import serializers

from questionnaire.models import preSurvey, postSurvey
from authentication.serializers import AccountSerializerPrivate


class PreSurveySerializer(serializers.ModelSerializer):
    user = AccountSerializerPrivate(read_only=True, required=False, allow_null=True, partial=True)

    class Meta:
        model = preSurvey

        fields = "__all__"

        read_only_fields = ['id']


class PostSurveySerializer(serializers.ModelSerializer):
    user = AccountSerializerPrivate(read_only=True, required=False, allow_null=True, partial=True)

    class Meta:
        model = postSurvey

        fields = "__all__"

        read_only_fields = ['id']
