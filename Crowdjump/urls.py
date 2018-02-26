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
from website.views import IndexView, HistoryViewSet
from ideas.views import IdeaViewSet, AccountIdeasViewSet

from authentication.views import AccountViewSet, LoginView, LogoutView
from django.views.generic.base import RedirectView
from django.contrib.staticfiles.storage import staticfiles_storage


router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'ideas', IdeaViewSet)
router.register(r'website', HistoryViewSet)

accounts_router = routers.NestedSimpleRouter(
    router, r'accounts', lookup='account'
)
accounts_router.register(r'ideas', AccountIdeasViewSet)

urlpatterns = [
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/', include(accounts_router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),

    url('^.*$', IndexView.as_view(), name='index'),

    url(r'^favicon\.ico$',RedirectView.as_view(url='/static/images/favicon.ico')),

    url(r'^favicon.ico/$',
        RedirectView.as_view( # the redirecting function
            url=staticfiles_storage.url('website/images/favicon.ico'),
        ),
        name="favicon"
    ),
]

# urlpatterns = [
#     url(r'^$', views.homepage, name='home'),
#     path('website/', include('website.urls')),
#     path('admin/', admin.site.urls),
#
# ]
#
# user_urls = [url(r'^/2(?P<username>[0-9a-zA-Z_-]+)$', UserDetail.as_view(), name='user-detail'),
#              url(r'^$', UserList.as_view(), name='user-list')
#              ]
#
# idea_urls = [url(r'^$', IdeaList.as_view(), name='idea-list'),
#              url(r'^$', CurrentIdeaList.as_view(), name='currentidea-list'),
#              url(r'^/(?P<pk>\d+)$', IdeaDetail.as_view(), name='idea-detail'),
#              url(r'^/(?P<username>[0-9a-zA-Z_-]+)/ideas$', UserIdeaList.as_view(), name='useridea-list'),
#              ]
#
# info_urls = []
#
# vote_urls = [url(r'^/(?P<pk>\d+/votes)$', VoteList.as_view(), name='vote-list'),
#              ]
#
# urlpatterns += [url(r'^users', include(user_urls)),
#                 url(r'^ideas', include(idea_urls)),
#                 # url(r'^info', include(info_urls)),
#                 # url(r'^vote', include(vote_urls)),
#                 ]
