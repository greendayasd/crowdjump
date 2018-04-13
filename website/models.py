from datetime import datetime
from django.db import models
from django.utils import timezone
from django.contrib.auth.models import AbstractUser


class Version(models.Model):
    label = models.CharField(max_length=25, unique=True)
    change = models.CharField(max_length=200)

    created_at = models.DateTimeField('date published', default=datetime.now)
    vote_weight = models.IntegerField(default=-1)

    submitter = models.ForeignKey('authentication.Account', on_delete=models.DO_NOTHING, null=True)

    # submitter = models.CharField(max_length=200, default="")


    #current state of the game
    features_game = models.CharField(max_length=200, default="")
    features_design = models.CharField(max_length=200, default="")
    features_selection = models.CharField(max_length=200, default="")
    features_website = models.CharField(max_length=200, default="")


    def __unicode__(self):
        return self.label

    def __str__(self):
        return self.label

    def is_newest(self):
        if self == Version.objects.latest():
            return True
        return False

    def get_newest(pos):
        return Version.objects.all().order_by('-id')[pos]


