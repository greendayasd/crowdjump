from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from website.models import Version, WebsiteInfo, GameInfo


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


class Account(AbstractBaseUser):

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=40, unique=True)

    first_name = models.CharField(max_length=40, blank=True)
    last_name = models.CharField(max_length=40, blank=True)
    tagline = models.CharField(max_length=140, blank=True)

    requests_left = models.IntegerField(default=1)
    votes_left = models.IntegerField(default=1)
    email_confirmed = models.BooleanField(default=False)

    is_admin = models.BooleanField(default=False)
    # is_activated = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = AccountManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __unicode__(self):
        return self.email

    def get_full_name(self):
        return ' '.join([self.first_name, self.last_name])

    def get_short_name(self):
        return self.first_name

    def user_set_requests(self, new_requests):
        self.requests_left = new_requests

    def user_increase_requests(self):
        self.requests_left += 1

    def user_decrease_requests(self):
        self.requests_left -= 1

    def __str__(self):
        return self.username

    def current_version_beaten (self):
        ver = Version.objects.all().order_by('-id')[0]
        current = GameInfo.objects.all().filter(version=ver,user=self.user)
        return current.rounds_won >= 1
