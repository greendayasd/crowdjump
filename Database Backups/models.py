from django.db import models
from authentication.models import Account


class preSurvey(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='questionnairePre',
                             null=True)  # nur zwischengespeichert
    site0 = models.TextField(default='', null=True)

    #site1
    Age_Combobox = models.TextField(default='', null=True, blank=True)
    Gender_Combobox = models.TextField(default='', null=True, blank=True)
    HoursPCWeek_Combobox = models.TextField(default='', null=True, blank=True)
    VideogamesWeek_Combobox = models.TextField(default='', null=True, blank=True)
    ImportantAspect_Checkbox = models.TextField(default='', null=True, blank=True)
    MostImportantAspect_Radiolist = models.TextField(default='', null=True, blank=True)
    PlayPlatformers_7scale = models.TextField(default='', null=True, blank=True)
    LikePlatformers_7scale = models.TextField(default='', null=True, blank=True)
    LikePlatformersMore_7scale = models.TextField(default='', null=True, blank=True)
    EverDesignedVG_bool = models.TextField(default='', null=True, blank=True)
    EverDesignedApp_bool = models.TextField(default='', null=True, blank=True)
    DesignProcess_bool = models.TextField(default='', null=True, blank=True)
    HowInDesignProcess_text = models.TextField(default='', null=True, blank=True)
    WatchedTP_bool = models.TextField(default='', null=True, blank=True)
    ParticipateTP_bool = models.TextField(default='', null=True, blank=True)
    LikeTP_7scale = models.TextField(default='', null=True, blank=True)
    HeardPBN_bool = models.TextField(default='', null=True, blank=True)
    PlayPBN_bool = models.TextField(default='', null=True, blank=True)
    LikePBN_7scale = models.TextField(default='', null=True, blank=True)
    IdeaPBN_bool = models.TextField(default='', null=True, blank=True)


    #site2
    ABSurvey0 = models.TextField(default='', null=True, blank=True)
    ABSurvey1 = models.TextField(default='', null=True, blank=True)
    ABSurvey2 = models.TextField(default='', null=True, blank=True)
    ABSurvey3 = models.TextField(default='', null=True, blank=True)
    ABSurvey4 = models.TextField(default='', null=True, blank=True)
    ABSurvey5 = models.TextField(default='', null=True, blank=True)
    ABSurvey6 = models.TextField(default='', null=True, blank=True)
    ABSurvey7 = models.TextField(default='', null=True, blank=True)
    ABSurvey8 = models.TextField(default='', null=True, blank=True)
    ABSurvey9 = models.TextField(default='', null=True, blank=True)

    def __str__(self):
        return self.site0

    def __unicode__(self):
        return '{0}'.format(self.site0)


class postSurvey(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='questionnairePost',
                             null=True)  # nur zwischengespeichert
    site0 = models.TextField(default='', null=True)
    site1 = models.TextField(default='', null=True)
    site2 = models.TextField(default='', null=True)
    site3 = models.TextField(default='', null=True)
    site4 = models.TextField(default='', null=True)
    site5 = models.TextField(default='', null=True)
    site6 = models.TextField(default='', null=True)

    def __str__(self):
        return self.site0 + self.site1 + self.site2 + self.site3 + self.site4 + self.site5 + self.site6

    def __unicode__(self):
        return '{0}'.format(self.site0)
