from rest_framework import serializers

from questionnaire.models import preSurvey, postSurvey, registrationForm
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


class RegistrationFormSerializer(serializers.ModelSerializer):

    class Meta:
        model = registrationForm

        fields = "__all__"

        read_only_fields = ['id']
