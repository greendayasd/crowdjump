from django.urls import path
from django.conf.urls import url, include
from . import views
from .views import UserList, UserDetail, IdeaList, CurrentIdeaList, IdeaDetail, UserIdeaList, VersionList

app_name = 'website'

urlpatterns = [
    # url(r'^$', views.homepage, name='index'),
]

