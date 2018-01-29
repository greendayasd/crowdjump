from .models import Idea, Version, WebsiteInfo, GameInfo, Vote
from rest_framework import generics, permissions
from .serializers import UserSerializer, IdeaSerializer, VersionSerializer, VoteSerializer
from django.shortcuts import render, redirect, render_to_response
from .permissions import *
from authentication.models import Account


def homepage(request):
    return render(request, 'website/home.html')


class UserList(generics.ListCreateAPIView):
    model = Account
    queryset = Account.objects.all()
    serializer_class = UserSerializer
    permission_classes = [
        permissions.AllowAny
    ]
    # permission_classes = (IsAdminUser,)


class UserDetail(generics.RetrieveAPIView):
    model = Account
    queryset = Account.objects.all()
    serializer_class = UserSerializer
    lookup_field = 'username'


class IdeaList(generics.ListCreateAPIView):
    model = Idea
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    permission_classes = [
        permissions.AllowAny
    ]


class CurrentIdeaList(generics.ListCreateAPIView):
    model = Idea
    serializer_class = IdeaSerializer
    permission_classes = [
        permissions.AllowAny
    ]

    def get_queryset(self):
        ver = Version.objects.all().order_by('-id')[0]
        return Idea.objects.filter(version=ver)


class IdeaDetail(generics.RetrieveUpdateDestroyAPIView):
    model = Idea
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    permission_classes = [
        permissions.AllowAny
    ]


class UserIdeaList(generics.ListAPIView):
    model = Idea
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer

    # permission_classes = IsOwnerOrReadOnly

    def get_queryset(self):
        queryset = super(UserIdeaList, self).get_queryset()
        return queryset.filter(user__username=self.kwargs.get('username'))


class VersionList(generics.ListCreateAPIView):
    model = Version
    queryset = Version.objects.all()
    serializer_class = VersionSerializer
    permission_classes = [
        permissions.AllowAny
    ]


class VoteList(generics.ListCreateAPIView):
    # todo
    model = Vote
    queryset = Vote.objects.all()
    serializer_class = VoteSerializer
    permission_classes = [
        permissions.AllowAny
    ]


# gameinfo
# websiteinfo


class IdeaMixin(object):
    model = Idea
    queryset = Idea.objects.all()
    serializer_class = IdeaSerializer
    permission_classes = [
        IdeaAuthorCanEditPermission
    ]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class IdeaList(IdeaMixin, generics.ListCreateAPIView):
    pass


class IdeaDetail(IdeaMixin, generics.RetrieveUpdateDestroyAPIView):
    pass
