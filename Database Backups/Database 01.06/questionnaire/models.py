from django.db import models


class preSurvey(models.Model):
    username = models.CharField(max_length=50, null=True, default='')

    def __str__(self):
        return self.version.label + '  ' + self.user.username + '  ' + self.rounds_won + ...
        '/' + self.rounds_started


    def __unicode__(self):
        return '{0}'.format(self.description)
