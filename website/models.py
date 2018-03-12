from datetime import datetime
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser


class Version(models.Model):
    label = models.CharField(max_length=25, unique=True)
    change = models.CharField(max_length=200)
    created_at = models.DateTimeField('date published', default=datetime.now)

    submitter = models.ForeignKey('authentication.Account', on_delete=models.DO_NOTHING, null=True)

    def __unicode__(self):
        return self.label

    def __str__(self):
        return self

    def is_newest(self):
        if self == Version.objects.latest():
            return True
        return False

    def get_newest(pos):
        return Version.objects.all().order_by('-id')[pos]

# class GameInfo(models.Model):
#     user = models.ForeignKey('authentication.Account', on_delete=models.CASCADE, related_name='gameinfo')
#     version = models.ForeignKey(Version, on_delete=models.CASCADE, null=True, related_name='gameinfo')
#     rounds_started = models.IntegerField(default=0)
#     rounds_won = models.IntegerField(default=0)
#     rounds_lost = models.IntegerField(default=0)
#     enemies_killed = models.IntegerField(default=0)
#     coins_collected = models.IntegerField(default=0)
#     highscore = models.IntegerField(default=-1)
#
#     def __str__(self):
#         return self.version.label + '  ' + self.user.username + '  ' + self.rounds_won + ...
#         '/' + (self.rounds_won + self.rounds_lost)
#
#
# class WebsiteInfo(models.Model):
#     user = models.ForeignKey('authentication.Account', on_delete=models.CASCADE, related_name='websiteinfo')
#     version = models.ForeignKey(Version, on_delete=models.CASCADE, null=True, related_name='websiteinfo')
#     time_spent_game = models.IntegerField(default=0)
#     time_spent_ideas = models.IntegerField(default=0)
#     time_spent_index = models.IntegerField(default=0)
#     time_spent_history = models.IntegerField(default=0)
#     time_spent_chat = models.IntegerField(default=0)

