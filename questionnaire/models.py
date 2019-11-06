from django.db import models
from authentication.models import Account


class registrationForm(models.Model):
    csrf = models.TextField(default='', null=True)

    # site1
    email = models.EmailField(default='', null=True, blank=True)
    alreadyParticipated_bool = models.TextField(default='', null=True, blank=True)
    interestedInDevelopment_bool = models.TextField(default='', null=True, blank=True)
    influenceOverDevelopment_bool = models.TextField(default='', null=True, blank=True)

    def __str__(self):
        return self.email

    def __unicode__(self):
        return '{0}'.format(self.email)


class preSurvey(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='questionnairePre',
                             null=True)  # nur zwischengespeichert
    site0 = models.TextField(default='', null=True)

    # site1
    Age_Combobox = models.TextField(default='', null=True, blank=True)
    Gender_Combobox = models.TextField(default='', null=True, blank=True)
    Job = models.TextField(default='', null=True, blank=True)
    HoursPCWeek_Combobox = models.TextField(default='', null=True, blank=True)
    VideogamesWeek_Combobox = models.TextField(default='', null=True, blank=True)
    ImportantAspect_Checkbox = models.TextField(default='', null=True, blank=True)
    ImportantAspectOther_Checkbox = models.TextField(default='', null=True, blank=True)
    MostImportantAspect_Radiolist = models.TextField(default='', null=True, blank=True)
    MostImportantAspectOther_Radiolist = models.TextField(default='', null=True, blank=True)
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

    # site2
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

    # site1

    # site2 GEQ
    GEQ00 = models.TextField(default='', null=True, blank=True)
    GEQ01 = models.TextField(default='', null=True, blank=True)
    GEQ02 = models.TextField(default='', null=True, blank=True)
    GEQ03 = models.TextField(default='', null=True, blank=True)
    GEQ04 = models.TextField(default='', null=True, blank=True)
    GEQ05 = models.TextField(default='', null=True, blank=True)
    GEQ06 = models.TextField(default='', null=True, blank=True)
    GEQ07 = models.TextField(default='', null=True, blank=True)
    GEQ08 = models.TextField(default='', null=True, blank=True)
    GEQ09 = models.TextField(default='', null=True, blank=True)
    GEQ10 = models.TextField(default='', null=True, blank=True)
    GEQ11 = models.TextField(default='', null=True, blank=True)
    GEQ12 = models.TextField(default='', null=True, blank=True)
    GEQ13 = models.TextField(default='', null=True, blank=True)
    GEQ14 = models.TextField(default='', null=True, blank=True)
    GEQ15 = models.TextField(default='', null=True, blank=True)
    GEQ16 = models.TextField(default='', null=True, blank=True)
    GEQ17 = models.TextField(default='', null=True, blank=True)
    GEQ18 = models.TextField(default='', null=True, blank=True)
    GEQ19 = models.TextField(default='', null=True, blank=True)
    GEQ20 = models.TextField(default='', null=True, blank=True)
    GEQ21 = models.TextField(default='', null=True, blank=True)
    GEQ22 = models.TextField(default='', null=True, blank=True)
    GEQ23 = models.TextField(default='', null=True, blank=True)
    GEQ24 = models.TextField(default='', null=True, blank=True)
    GEQ25 = models.TextField(default='', null=True, blank=True)
    GEQ26 = models.TextField(default='', null=True, blank=True)
    GEQ27 = models.TextField(default='', null=True, blank=True)
    GEQ28 = models.TextField(default='', null=True, blank=True)
    GEQ29 = models.TextField(default='', null=True, blank=True)
    GEQ30 = models.TextField(default='', null=True, blank=True)
    GEQ31 = models.TextField(default='', null=True, blank=True)
    GEQ32 = models.TextField(default='', null=True, blank=True)

    # site3 SPGQ
    SPGQ00 = models.TextField(default='', null=True, blank=True)
    SPGQ01 = models.TextField(default='', null=True, blank=True)
    SPGQ02 = models.TextField(default='', null=True, blank=True)
    SPGQ03 = models.TextField(default='', null=True, blank=True)
    SPGQ04 = models.TextField(default='', null=True, blank=True)
    SPGQ05 = models.TextField(default='', null=True, blank=True)
    SPGQ06 = models.TextField(default='', null=True, blank=True)
    SPGQ07 = models.TextField(default='', null=True, blank=True)
    SPGQ08 = models.TextField(default='', null=True, blank=True)
    SPGQ09 = models.TextField(default='', null=True, blank=True)
    SPGQ10 = models.TextField(default='', null=True, blank=True)
    SPGQ11 = models.TextField(default='', null=True, blank=True)
    SPGQ12 = models.TextField(default='', null=True, blank=True)
    SPGQ13 = models.TextField(default='', null=True, blank=True)
    SPGQ14 = models.TextField(default='', null=True, blank=True)
    SPGQ15 = models.TextField(default='', null=True, blank=True)
    SPGQ16 = models.TextField(default='', null=True, blank=True)
    SPGQ17 = models.TextField(default='', null=True, blank=True)
    SPGQ18 = models.TextField(default='', null=True, blank=True)
    SPGQ19 = models.TextField(default='', null=True, blank=True)
    SPGQ20 = models.TextField(default='', null=True, blank=True)

    # newSite 3 Gamex

    GAM00 = models.TextField(default='', null=True, blank=True)
    GAM01 = models.TextField(default='', null=True, blank=True)
    GAM02 = models.TextField(default='', null=True, blank=True)
    GAM03 = models.TextField(default='', null=True, blank=True)
    GAM04 = models.TextField(default='', null=True, blank=True)
    GAM05 = models.TextField(default='', null=True, blank=True)
    GAM06 = models.TextField(default='', null=True, blank=True)
    GAM07 = models.TextField(default='', null=True, blank=True)
    GAM08 = models.TextField(default='', null=True, blank=True)
    GAM09 = models.TextField(default='', null=True, blank=True)
    GAM10 = models.TextField(default='', null=True, blank=True)
    GAM11 = models.TextField(default='', null=True, blank=True)
    GAM12 = models.TextField(default='', null=True, blank=True)
    GAM13 = models.TextField(default='', null=True, blank=True)
    GAM14 = models.TextField(default='', null=True, blank=True)
    GAM15 = models.TextField(default='', null=True, blank=True)
    GAM16 = models.TextField(default='', null=True, blank=True)
    GAM17 = models.TextField(default='', null=True, blank=True)
    GAM18 = models.TextField(default='', null=True, blank=True)
    GAM19 = models.TextField(default='', null=True, blank=True)
    GAM20 = models.TextField(default='', null=True, blank=True)
    GAM21 = models.TextField(default='', null=True, blank=True)
    GAM22 = models.TextField(default='', null=True, blank=True)
    GAM23 = models.TextField(default='', null=True, blank=True)
    GAM24 = models.TextField(default='', null=True, blank=True)
    GAM25 = models.TextField(default='', null=True, blank=True)
    GAM26 = models.TextField(default='', null=True, blank=True)

    # OLD site4 KIM / IMI
    KIM00 = models.TextField(default='', null=True, blank=True)
    KIM01 = models.TextField(default='', null=True, blank=True)
    KIM02 = models.TextField(default='', null=True, blank=True)
    KIM03 = models.TextField(default='', null=True, blank=True)
    KIM04 = models.TextField(default='', null=True, blank=True)
    KIM05 = models.TextField(default='', null=True, blank=True)
    KIM06 = models.TextField(default='', null=True, blank=True)
    KIM07 = models.TextField(default='', null=True, blank=True)
    KIM08 = models.TextField(default='', null=True, blank=True)
    KIM09 = models.TextField(default='', null=True, blank=True)
    KIM10 = models.TextField(default='', null=True, blank=True)
    KIM11 = models.TextField(default='', null=True, blank=True)

    # IMI NEW

    IMI00 = models.TextField(default='', null=True, blank=True)
    IMI01 = models.TextField(default='', null=True, blank=True)
    IMI02 = models.TextField(default='', null=True, blank=True)
    IMI03 = models.TextField(default='', null=True, blank=True)
    IMI04 = models.TextField(default='', null=True, blank=True)
    IMI05 = models.TextField(default='', null=True, blank=True)
    IMI06 = models.TextField(default='', null=True, blank=True)
    IMI07 = models.TextField(default='', null=True, blank=True)
    IMI08 = models.TextField(default='', null=True, blank=True)
    IMI09 = models.TextField(default='', null=True, blank=True)
    IMI10 = models.TextField(default='', null=True, blank=True)
    IMI11 = models.TextField(default='', null=True, blank=True)
    IMI12 = models.TextField(default='', null=True, blank=True)
    IMI13 = models.TextField(default='', null=True, blank=True)
    IMI14 = models.TextField(default='', null=True, blank=True)
    IMI15 = models.TextField(default='', null=True, blank=True)
    IMI16 = models.TextField(default='', null=True, blank=True)
    IMI17 = models.TextField(default='', null=True, blank=True)
    IMI18 = models.TextField(default='', null=True, blank=True)
    IMI19 = models.TextField(default='', null=True, blank=True)
    IMI20 = models.TextField(default='', null=True, blank=True)
    IMI21 = models.TextField(default='', null=True, blank=True)
    IMI22 = models.TextField(default='', null=True, blank=True)
    IMI23 = models.TextField(default='', null=True, blank=True)
    IMI24 = models.TextField(default='', null=True, blank=True)
    IMI25 = models.TextField(default='', null=True, blank=True)

    # site5 SUS
    SUS00 = models.TextField(default='', null=True, blank=True)
    SUS01 = models.TextField(default='', null=True, blank=True)
    SUS02 = models.TextField(default='', null=True, blank=True)
    SUS03 = models.TextField(default='', null=True, blank=True)
    SUS04 = models.TextField(default='', null=True, blank=True)
    SUS05 = models.TextField(default='', null=True, blank=True)
    SUS06 = models.TextField(default='', null=True, blank=True)
    SUS07 = models.TextField(default='', null=True, blank=True)
    SUS08 = models.TextField(default='', null=True, blank=True)
    SUS09 = models.TextField(default='', null=True, blank=True)

    # site6 general
    General00 = models.TextField(default='', null=True, blank=True)
    General01 = models.TextField(default='', null=True, blank=True)
    General02 = models.TextField(default='', null=True, blank=True)
    General03 = models.TextField(default='', null=True, blank=True)
    General04 = models.TextField(default='', null=True, blank=True)
    General05 = models.TextField(default='', null=True, blank=True)
    General06 = models.TextField(default='', null=True, blank=True)
    General07 = models.TextField(default='', null=True, blank=True)
    General08 = models.TextField(default='', null=True, blank=True)
    General09 = models.TextField(default='', null=True, blank=True)
    General10 = models.TextField(default='', null=True, blank=True)
    General11 = models.TextField(default='', null=True, blank=True)
    General12 = models.TextField(default='', null=True, blank=True)
    General13 = models.TextField(default='', null=True, blank=True)
    General14 = models.TextField(default='', null=True, blank=True)
    General15 = models.TextField(default='', null=True, blank=True)
    General16 = models.TextField(default='', null=True, blank=True)

    def __str__(self):
        return self.site0

    def __unicode__(self):
        return '{0}'.format(self.site0)
