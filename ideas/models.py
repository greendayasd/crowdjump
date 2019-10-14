from django.db import models
from authentication.models import Account
from django.utils import timezone
from datetime import datetime
from website.models import Version


def get_latest_version():
    return Version.objects.all().order_by('-id')[0].id

class Idea(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='ideas')
    version = models.ForeignKey(Version, on_delete=models.DO_NOTHING, related_name='ideas'
                                , default=get_latest_version())

    request_text = models.CharField(max_length=50)
    description = models.CharField(max_length=500)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    update_count = models.IntegerField(default=0)

    feasible = models.BooleanField(default=True)
    currently_implemented = models.BooleanField(default=False)
    date_chosen = models.DateTimeField(null=True)

    implemented = models.BooleanField(default=False)
    implemented_at = models.DateTimeField(null=True)

    deleted = models.BooleanField(default=False)

    admin_comment = models.CharField(max_length=50, null=True, default='')
    estimated_time = models.CharField(max_length=50, null=True, default='')
    time_needed = models.CharField(max_length=50, null=True, default='')

    newest_comment = models.IntegerField(default=-1)

    upvotes = models.IntegerField(default=0)
    downvotes = models.IntegerField(default=0)

    #classification
    rater1 = models.CharField(max_length=50, null=True, default='')
    rater2 = models.CharField(max_length=50, null=True, default='')
    raterfinal = models.CharField(max_length=50, null=True, default='')

    def __unicode__(self):
        return '{0}'.format(self.description)

    def was_created_recently(self):
        now = timezone.now()
        return now - datetime.timedelta(days=1) <= self.created_at <= now

    def was_updated_recently(self):
        now = timezone.now()
        return now - datetime.timedelta(days=1) <= self.updated_at <= now

    def vote(self, v):
        if v < 0:
            self.downvotes += 1

        if v > 0:
            self.upvotes += 1

        self.save()

    def update_vote(self, old_v, new_v):
        if old_v < 0:
            self.downvotes -= 1

        if old_v > 0:
            self.upvotes -= 1

        self.vote(self, new_v)


class Comment(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='comments')
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='comments')

    text = models.CharField(max_length=140)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    status = models.IntegerField(default=-1, null=True)
    deleted = models.BooleanField(default=False)

    upvotes = models.IntegerField(default=0, null=True)
    downvotes = models.IntegerField(default=0, null=True)

    #classification
    rater1 = models.CharField(max_length=50, null=True, default='')
    rater2 = models.CharField(max_length=50, null=True, default='')
    raterfinal = models.CharField(max_length=50, null=True, default='')

    def __unicode__(self):
        return '{0}'.format(self.description)

    def was_created_recently(self):
        now = timezone.now()
        return now - datetime.timedelta(days=1) <= self.created_at <= now

    def was_updated_recently(self):
        now = timezone.now()
        return now - datetime.timedelta(days=1) <= self.updated_at <= now


class IdeaVote(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='ideavotes')
    idea = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='ideavotes')

    #     -1 = downvote, 0 = no vote, 1 = upvote
    vote = models.IntegerField(default=0)
    multiplier = models.DecimalField(default=1, max_digits=5, decimal_places=2)


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class CommentVote(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='commentvotes')
    comment = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='commentvotes')

    #     -1 = downvote, 0 = no vote, 1 = upvote
    vote = models.IntegerField(default=0)
    multiplier = models.DecimalField(default=1, max_digits=5, decimal_places=2)


    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Bugreport(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='bugr3eport')
    version = models.ForeignKey(Version, on_delete=models.DO_NOTHING, related_name='bugreport'
                                , default=get_latest_version())

    request_text = models.CharField(max_length=50)
    description = models.CharField(max_length=500)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    fixed = models.BooleanField(default=False)

    deleted = models.BooleanField(default=False)

    admin_comment = models.CharField(max_length=50, null=True, default='')