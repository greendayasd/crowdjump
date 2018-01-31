from django.urls import path
from django.conf.urls import url, include
from website.views import IndexView
from authentication.views import LoginView
from .views import UserList, UserDetail, IdeaList, CurrentIdeaList, IdeaDetail, UserIdeaList, VersionList

app_name = 'website'

urlpatterns = [
    url('^.*$', IndexView.as_view(), name='index'),
]

