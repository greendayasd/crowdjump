from django.db import models
from authentication.models import Account
from django.utils import timezone
from datetime import datetime
from website.models import Version


class Idea(models.Model):
    user = models.ForeignKey('authentication.Account', on_delete=models.CASCADE, related_name='ideas')
    version = models.ForeignKey(Version, on_delete=models.DO_NOTHING, related_name='ideas')
                                 #default=Version.objects.all().order_by('-id')[0])
    # version = models.CharField(max_length= 25, default="0,01")
    request_text = models.CharField(max_length=50)
    description = models.CharField(max_length=500)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    manageable = models.BooleanField(default=True)
    implemented = models.BooleanField(default=False)

    admin_comment = models.CharField(max_length=50, null=True, default='')
    estimated_time = models.CharField(max_length=50, null=True, default='')
    upvotes = models.IntegerField(default=0)
    downvotes = models.IntegerField(default=0)

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

    text = models.CharField(max_length=40)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    upvotes = models.IntegerField(default=0)
    downvotes = models.IntegerField(default=0)

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


class CommentVote(models.Model):
    user = models.ForeignKey(Account, on_delete=models.CASCADE, related_name='commentvotes')
    comment = models.ForeignKey(Idea, on_delete=models.CASCADE, related_name='commentvotes')

    #     -1 = downvote, 0 = no vote, 1 = upvote
    vote = models.IntegerField(default=0)
