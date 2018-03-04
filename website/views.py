
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.generic.base import TemplateView
from django.utils.decorators import method_decorator
from .models import Version
from .serializers import VersionSerializer
from rest_framework import permissions, viewsets
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
    template_name = 'idea_index.html'

    @method_decorator(ensure_csrf_cookie)
    def dispatch(self, *args, **kwargs):
        return super(IdeasView, self).dispatch(*args, **kwargs)


class HistoryViewSet(viewsets.ModelViewSet):
    model = Version
    queryset = Version.objects.order_by('-created_at')
    serializer_class = VersionSerializer
    permission_classes = [
        permissions.AllowAny
    ]


# class UserList(generics.ListCreateAPIView):
#     model = Account
#     queryset = Account.objects.all()
#     serializer_class = UserSerializer
#     permission_classes = [
#         permissions.AllowAny
#     ]
#     # permission_classes = (IsAdminUser,)
#
#
# class UserDetail(generics.RetrieveAPIView):
#     model = Account
#     queryset = Account.objects.all()
#     serializer_class = UserSerializer
#     lookup_field = 'username'
#
#
# class IdeaList(generics.ListCreateAPIView):
#     model = Idea
#     queryset = Idea.objects.all()
#     serializer_class = IdeaSerializer
#     permission_classes = [
#         permissions.AllowAny
#     ]
#
#
# class CurrentIdeaList(generics.ListCreateAPIView):
#     model = Idea
#     serializer_class = IdeaSerializer
#     permission_classes = [
#         permissions.AllowAny
#     ]
#
#     def get_queryset(self):
#         ver = Version.objects.all().order_by('-id')[0]
#         return Idea.objects.filter(version=ver)
#
#
# class IdeaDetail(generics.RetrieveUpdateDestroyAPIView):
#     model = Idea
#     queryset = Idea.objects.all()
#     serializer_class = IdeaSerializer
#     permission_classes = [
#         permissions.AllowAny
#     ]
#
#
# class UserIdeaList(generics.ListAPIView):
#     model = Idea
#     queryset = Idea.objects.all()
#     serializer_class = IdeaSerializer
#
#     # permission_classes = IsOwnerOrReadOnly
#
#     def get_queryset(self):
#         queryset = super(UserIdeaList, self).get_queryset()
#         return queryset.filter(user__username=self.kwargs.get('username'))
#
#
# class VoteList(generics.ListCreateAPIView):
#     # todo
#     model = Vote
#     queryset = Vote.objects.all()
#     serializer_class = VoteSerializer
#     permission_classes = [
#         permissions.AllowAny
#     ]
#
#
# # gameinfo
# # websiteinfo
#
#
# class IdeaMixin(object):
#     model = Idea
#     queryset = Idea.objects.all()
#     serializer_class = IdeaSerializer
#     permission_classes = [
#         IdeaAuthorCanEditPermission
#     ]
#
#     def perform_create(self, serializer):
#         serializer.save(user=self.request.user)
#
#
# class IdeaList(IdeaMixin, generics.ListCreateAPIView):
#     pass
#
#
# class IdeaDetail(IdeaMixin, generics.RetrieveUpdateDestroyAPIView):
#     pass
