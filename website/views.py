
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from .models import Version
from .serializers import VersionSerializer
from rest_framework import permissions, viewsets
from django.contrib.staticfiles.templatetags.staticfiles import static
from ideas.models import Idea
from rest_framework.response import Response

# from ideas.models import Idea, Vote
# from rest_framework import generics, permissions
# from django.shortcuts import render, redirect, render_to_response
# from .permissions import *
# from authentication.models import Account


class IndexView(TemplateView):
    template_name = 'index.html'

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(IndexView, self).dispatch(*args, **kwargs)


class IdeasView(TemplateView):
    # template_name = 'idea_index.html'
    template_name = static('templates/layout/idea_index.html')

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(IdeasView, self).dispatch(*args, **kwargs)


class GameView(TemplateView):
    template_name = static('templates/layout/game.html')

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(GameView, self).dispatch(*args, **kwargs)


class GameInfoView(TemplateView):
    template_name = 'idea_index.html'

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(GameInfoView, self).dispatch(*args, **kwargs)


class GameViewSet(viewsets.ModelViewSet):
    model = Version
    queryset = Version.objects.order_by('-created_at')
    serializer_class = VersionSerializer
    permission_classes = [
        permissions.AllowAny
    ]


class HistoryViewSet(viewsets.ModelViewSet):
    model = Version
    queryset = Version.objects.order_by('-created_at')
    serializer_class = VersionSerializer
    permission_classes = [
        permissions.AllowAny
    ]

