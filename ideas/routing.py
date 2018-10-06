# chat/routing.py
from django.conf.urls import url

from . import consumers

websocket_urlpatterns = [
    url(r'^ws/ideas/$', consumers.IdeaConsumer),
    url(r'^ws/votes/$', consumers.VoteConsumer),
    url(r'^ws/bugreports/$', consumers.BugreportConsumer),
]