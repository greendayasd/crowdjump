"""BA URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url
from website import views
from rest_framework_nested import routers
from website.views import IndexView, HistoryViewSet, IdeasView, GameViewSet, GameInfoView, GameView
from ideas.views import IdeaViewSet, AccountIdeasViewSet, AccountGameInfoViewSet, GameInfoViewSet

from authentication.views import AccountViewSet, LoginView, LogoutView

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'ideas', IdeaViewSet)
router.register(r'gameinfo', GameInfoViewSet)


mainrouter = routers.SimpleRouter()
mainrouter.register(r'history', HistoryViewSet)
mainrouter.register(r'game', GameViewSet)

accounts_router = routers.NestedSimpleRouter(
    router, r'accounts', lookup='account'
)
accounts_router.register(r'ideas', AccountIdeasViewSet)
# accounts_router.register(r'gameinfo', AccountGameInfoViewSet)

urlpatterns = [
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/', include(accounts_router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),

    url(r'^ideas/$', IdeasView.as_view()),
    # url(r'^game/$', GameView.as_view()),
    # url(r'^gameinfo/$', GameInfoView.as_view()),

    url('^$', IndexView.as_view(), name='index'),


]

# urlpatterns += [url(r'^users', include(user_urls)),
#                 url(r'^ideas', include(idea_urls)),
#                 # url(r'^info', include(info_urls)),
#                 # url(r'^vote', include(vote_urls)),
#                 ]