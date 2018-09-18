from django.contrib import admin
from django.urls import path, include
from django.conf.urls import url
from website import views
from rest_framework_nested import routers
from website.views import IndexView, HistoryViewSet, IdeasView, GameViewSet, GameInfoView, GameView, AdminView
from ideas.views import IdeaViewSet, IdeaVotePermissionViewSet, AccountIdeasViewSet, AccountGameInfoViewSet, \
    GameInfoViewSet, CommentViewSet, IdeaVoteViewSet, Vote
from chat.views import room, index, ChatMessageViewSet
from questionnaire.views import PreSurveyViewSet, PostSurveyViewSet
from Crowdjump.mailFunctions import mail_new_version

from authentication.views import AccountViewSet, LoginView, LogoutView, SendTrackingData, GetTrackingData, \
    GetAllTrackingData, TransferData, SendGameData, GetGameData, GetAllGameDataUser, GetAllGameData, GetAllUserGame, \
    Unsubscribe, CreateGamedata, ChangeCharacter, UploadCharacter

from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static

router = routers.SimpleRouter()
router.register(r'accounts', AccountViewSet)
router.register(r'ideas', IdeaViewSet)
router.register(r'ideasvoting', IdeaVotePermissionViewSet)
router.register(r'gameinfo', GameInfoViewSet)
router.register(r'history', HistoryViewSet)
router.register(r'comments', CommentViewSet)
router.register(r'ideavotes', IdeaVoteViewSet)
router.register(r'chatmessages', ChatMessageViewSet)
router.register(r'presurvey', PreSurveyViewSet)
router.register(r'postsurvey', PostSurveyViewSet)

mainrouter = routers.SimpleRouter()
mainrouter.register(r'game', GameViewSet)

accounts_router = routers.NestedSimpleRouter(
    router, r'accounts', lookup='account'
)
accounts_router.register(r'ideas', AccountIdeasViewSet)
accounts_router.register(r'gameinfo', AccountGameInfoViewSet, base_name='gameinfo')

urlpatterns = [
    url(r'^api/v1/', include(router.urls)),
    url(r'^api/v1/', include(accounts_router.urls)),
    url(r'^api/v1/auth/login/$', LoginView.as_view(), name='login'),
    url(r'^api/v1/auth/logout/$', LogoutView.as_view(), name='logout'),

    # redirects
    url(r'^ideas/$', IndexView.as_view()),
    url(r'^game/$', IndexView.as_view()),
    url(r'^history/$', IndexView.as_view()),
    url(r'^login/$', IndexView.as_view()),
    url(r'^register/$', IndexView.as_view()),

    url(r'^admin/$', AdminView.as_view()),
    url(r'^profile/$', IndexView.as_view()),

    url(r'^survey0/$', IndexView.as_view()),
    url(r'^survey1/$', IndexView.as_view()),
    url(r'^survey2/$', IndexView.as_view()),
    url(r'^surveyPreFinished/$', IndexView.as_view()),
    url(r'^postsurvey0/$', IndexView.as_view()),
    url(r'^postsurvey1/$', IndexView.as_view()),
    url(r'^postsurvey2/$', IndexView.as_view()),
    url(r'^postsurvey3/$', IndexView.as_view()),
    url(r'^postsurvey4/$', IndexView.as_view()),
    url(r'^postsurvey5/$', IndexView.as_view()),
    url(r'^postsurvey6/$', IndexView.as_view()),
    url(r'^surveyPostFinished/$', IndexView.as_view()),
    url(r'^mobile/$', IndexView.as_view()),
    url(r'^oldbrowser/$', IndexView.as_view()),
    url(r'^unsubscribe/$', IndexView.as_view()),

    # url(r'^game/$', GameView.as_view()),
    # url(r'^gameinfo/$', GameInfoView.as_view()),
    url('^$', IndexView.as_view(), name='index'),

    url(r'^chat/$', IndexView.as_view()),
    url(r'^chatroom/$', IndexView.as_view()),
    url(r'^chat/(?P<room_name>[^/]+)/$', IndexView.as_view()),
    # url(r'^chat2/$', index, name='index'),
    # url(r'^chat2/(?P<room_name>[^/]+)/$', room, name='room'),

    # ajax requests
    url(r'^sendtracking/$', SendTrackingData, name='sendtracking'),
    url(r'^gettracking/$', GetTrackingData, name='gettracking'),
    url(r'^getalltracking/$', GetAllTrackingData, name='getalltracking'),
    url(r'^sendgamedata/$', SendGameData, name='sendgamedata'),
    url(r'^getgamedata/$', GetGameData, name='getgamedata'),
    url(r'^getallgamedatauser/$', GetAllGameDataUser, name='getallgamedatauser'),
    url(r'^getallgamedata/$', GetAllGameData, name='getallgamedata'),
    url(r'^getallusergame/$', GetAllUserGame, name='getallusergame'),
    url(r'^transferdata/$', TransferData, name='transferdata'),
    url(r'^vote/$', Vote, name='vote'),
    url(r'^unsubscribeNL/$', Unsubscribe, name='unsubscribeNL'),
    url(r'^createGamedata/$', CreateGamedata, name='createGamedata'),
    url(r'^changeCharacter/$', ChangeCharacter, name='changeCharacter'),
    url(r'^uploadCharacter/$', UploadCharacter, name='uploadCharacter'),

    url(r'^sendmail/$', mail_new_version, name='sendmail'),

]

# this connects STATIC_URL to STATIC_ROOT
urlpatterns += staticfiles_urlpatterns()

# urlpatterns += [url(r'^users', include(user_urls)),
#                 url(r'^ideas', include(idea_urls)),
#                 # url(r'^info', include(info_urls)),
#                 # url(r'^vote', include(vote_urls)),
#                 ]
