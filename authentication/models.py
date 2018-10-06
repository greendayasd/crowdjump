from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from website.models import Version
import os
from authentication.storage import OverwriteStorage
from django.core.exceptions import ValidationError


class AccountManager(BaseUserManager):
    def create_user(self, email, password=None, **kwargs):
        if not email:
            raise ValueError('Users must have a valid email address.')

        if not kwargs.get('username'):
            raise ValueError('Users must have a valid username.')

        account = self.model(
            email=self.normalize_email(email), username=kwargs.get('username')
        )

        account.set_password(password)
        account.save()

        return account

    def create_superuser(self, email, password, **kwargs):
        account = self.create_user(email, password, **kwargs)

        account.is_admin = True
        account.save()

        return account


def validate_character_size(image):
    validate_file_size(image, 20 * 1024)


def validate_file_size(file, bytes):
    file_size = file.file.size
    print(file_size)
    if file_size > bytes:
        raise ValidationError("Max size of file is %s Bytes" % bytes)


def character_upload(instance, filename):
    filename, file_extension = os.path.splitext('/' + filename)
    filename = str(instance.id) + file_extension
    return os.path.join('characters/', filename)


class Account(AbstractBaseUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=40, unique=True)

    first_name = models.CharField(max_length=40, blank=True)
    last_name = models.CharField(max_length=40, blank=True)
    tagline = models.CharField(max_length=140, blank=True)

    requests_left = models.IntegerField(default=1)
    votes_left = models.IntegerField(default=1)
    email_confirmed = models.BooleanField(default=False)
    email_notification = models.BooleanField(default=True)

    is_admin = models.BooleanField(default=False)
    is_activated = models.BooleanField(default=True)

    # weight
    vote_weight = models.IntegerField(default=1)
    vote_multiplier = models.DecimalField(default=1, max_digits=5, decimal_places=2)

    survey_status = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    versionlabel = models.CharField(max_length=40, blank=True, default='0.01')

    difficulty = models.IntegerField(default=1)
    muted = models.IntegerField(default=0)


    character = models.CharField(max_length=40, blank=True)
    uploaded_character = models.ImageField(upload_to=character_upload, storage=OverwriteStorage(), null=True,
                                           validators=[validate_character_size])

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __unicode__(self):
        return self.email

    def get_full_name(self):
        return ' '.join([self.first_name, self.last_name])

    def get_short_name(self):
        return self.first_names

    def user_set_requests(self, new_requests):
        self.requests_left = new_requests

    def user_increase_requests(self):
        self.requests_left += 1

    def user_decrease_requests(self):
        self.requests_left -= 1

    def __str__(self):
        return self.username

    def current_version_beaten(self):
        ver = Version.objects.all().order_by('-id')[0]
        current = GameInfo.objects.all().filter(version=ver, user=self.user)
        return current.rounds_won >= 1


def get_latest_version():
    return Version.objects.all().order_by('-id')[0].id


class GameInfo(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='gameinfo')
    version = models.ForeignKey(Version, on_delete=models.DO_NOTHING, related_name='gameinfo'
                                , default=get_latest_version())
    rounds_started = models.IntegerField(default=0)
    rounds_won = models.IntegerField(default=0)
    highest_level = models.IntegerField(default=0)
    enemies_killed = models.IntegerField(default=0)
    coins_collected = models.IntegerField(default=0)
    highscore = models.IntegerField(default=-1)
    time_spent_game = models.IntegerField(default=0)
    jumps = models.IntegerField(default=0)
    movement_inputs = models.IntegerField(default=0)
    deaths = models.IntegerField(default=0)
    restarts = models.IntegerField(default=0)
    eastereggs_found = models.IntegerField(default=0)
    special_name = models.IntegerField(default=0)
    powerups = models.IntegerField(default=0)


    difficulty = models.IntegerField(default=0)

    overall_coins = models.IntegerField(default=0)
    overall_eastereggs = models.IntegerField(default=0)
    overall_powerups = models.IntegerField(default=0)

    def __str__(self):
        return self.version.label + '  ' + self.user.username + '  ' + self.rounds_won + ...
        '/' + self.rounds_started

    def __unicode__(self):
        return '{0}'.format(self.description)


class WebsiteInfo(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='websiteinfo')
    version = models.ForeignKey(Version, on_delete=models.DO_NOTHING, related_name='websiteinfo'
                                , default=get_latest_version())

    time_spent_ideas = models.IntegerField(default=0)
    time_spent_index = models.IntegerField(default=0)
    time_spent_history = models.IntegerField(default=0)
    time_spent_chat = models.IntegerField(default=0)


# class Tracking(models.Model):
#     user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='Tracking', null=True, default=NULL)
#     unknown = models.TextField(default='', null=True, blank=True)
#     trackingdata = models.FileField(null=True,upload_to='trackingdata')


class FilterSettings(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='filtersettings')
    records_per_page = models.IntegerField(default=5)
