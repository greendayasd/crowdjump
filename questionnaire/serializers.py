from rest_framework import serializers

from questionnaire.models import preSurvey
from authentication.serializers import AccountSerializer


class PreSurveySerializer(serializers.ModelSerializer):
    user = AccountSerializer(read_only=True, required=False, allow_null=True, partial=True)

    class Meta:
        model = preSurvey

        fields = ('id', 'user', 'site0', 'site1', 'site2', 'site3', 'site4')

        read_only_fields = ['id']

