from rest_framework import permissions, viewsets
from rest_framework.response import Response
from url_filter.integrations.drf import DjangoFilterBackend
from django.views.decorators.csrf import csrf_exempt
from .serializers import PreSurveySerializer, PostSurveySerializer
from .models import preSurvey, postSurvey

@csrf_exempt
class PreSurveyViewSet(viewsets.ModelViewSet):
    queryset = preSurvey.objects
    serializer_class = PreSurveySerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['id', 'user']

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(),)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        return super(PreSurveyViewSet, self).perform_create(serializer)

@csrf_exempt
class PostSurveyViewSet(viewsets.ModelViewSet):
    queryset = postSurvey.objects
    serializer_class = PostSurveySerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['id', 'user']

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(),)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        return super(PostSurveyViewSet, self).perform_create(serializer)
