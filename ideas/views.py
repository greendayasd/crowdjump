from rest_framework import permissions, viewsets
from rest_framework.response import Response
from website.models import Version
from website.serializers import VersionSerializer

from ideas.models import Idea, CommentVote, IdeaVote, Comment
from ideas.permissions import IsCreaterOfIdea, IsOwnerOfInfo
from ideas.serializers import IdeaSerializer, IdeaVotingPermissionSerializer, GameInfoSerializer, CommentSerializer, IdeaVoteSerializer

from authentication.models import GameInfo
from url_filter.integrations.drf import DjangoFilterBackend


class IdeaViewSet(viewsets.ModelViewSet):
    queryset = Idea.objects.order_by('-created_at')
    serializer_class = IdeaSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['deleted', 'version', 'user', 'id']

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsCreaterOfIdea(),)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        return super(IdeaViewSet, self).perform_create(serializer)


class IdeaVotePermissionViewSet(viewsets.ModelViewSet):
    queryset = Idea.objects.order_by('-created_at')
    serializer_class = IdeaVotingPermissionSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['deleted', 'version', 'user', 'id', 'implemented']

    def get_permissions(self):
        return (permissions.AllowAny(),)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        return super(IdeaViewSet, self).perform_create(serializer)


class AccountIdeasViewSet(viewsets.ViewSet):
    queryset = Idea.objects.select_related('user').all()
    serializer_class = IdeaSerializer

    def list(self, request, account_username=None):
        queryset = self.queryset.filter(user__username=account_username)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)


class GameInfoViewSet(viewsets.ModelViewSet):
    queryset = GameInfo.objects.order_by('-version','highscore')
    serializer_class = GameInfoSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['highscore', 'version', 'user', 'id']

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return (permissions.AllowAny(),)
        return (permissions.IsAuthenticated(), IsOwnerOfInfo(),)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        return super(GameInfoViewSet, self).perform_create(serializer)


class AccountGameInfoViewSet(viewsets.ViewSet):
    queryset = GameInfo.objects.select_related('user').all()
    serializer_class = GameInfoSerializer

    def list(self, request, account_username=None):
        queryset = self.queryset.filter(user__username=account_username)
        serializer = self.serializer_class(queryset, many=True)

        return Response(serializer.data)

    # def get(self, request, format=None):
    #     gameinfo = GameInfo.objects.select_related('user').all()
    #     serializer = AccountSerializer(gameinfo, many=True)
    #     return Response(serializer.data)


class HistoryViewSet(viewsets.ModelViewSet):
    queryset = Version.objects.order_by('-created_at')
    serializer_class = VersionSerializer

    def get_permissions(self):
        return permissions.AllowAny()

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        return super(HistoryViewSet, self).perform_create(serializer)


class CommentViewSet(viewsets.ModelViewSet):
    queryset = Comment.objects.order_by('-created_at')
    serializer_class = CommentSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['deleted', 'idea', 'user']

    # def get_permissions(self):
    #     if self.request.method in permissions.SAFE_METHODS:
    #         return (permissions.AllowAny(),)
    #     return (permissions.IsAuthenticated(), IsOwnerOfInfo(),)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        return super(CommentViewSet, self).perform_create(serializer)


class IdeaVoteViewSet(viewsets.ModelViewSet):
    queryset = IdeaVote.objects.order_by('id')
    serializer_class = IdeaVoteSerializer
    filter_backends = [DjangoFilterBackend]
    filter_fields = ['idea', 'user', 'vote']

    # def get_permissions(self):
    #     if self.request.method in permissions.SAFE_METHODS:
    #         return (permissions.AllowAny(),)
    #     return (permissions.IsAuthenticated(), IsOwnerOfInfo(),)

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        return super(IdeaVoteViewSet, self).perform_create(serializer)
