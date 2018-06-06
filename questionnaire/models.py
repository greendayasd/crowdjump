from django.db import models
from authentication.models import Account


class preSurvey(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='questionnaire', null=True)  # nur zwischengespeichert
    site0 = models.TextField(default='', null=True)
    site1 = models.TextField(default='', null=True)
    site2 = models.TextField(default='', null=True)
    site3 = models.TextField(default='', null=True)
    site4 = models.TextField(default='', null=True)

    def __str__(self):
        return self.site0 + self.site1 + self.site2 + self.site3 + self.site4

    def __unicode__(self):
        return '{0}'.format(self.site0)
