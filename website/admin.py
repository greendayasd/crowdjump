from django.contrib import admin
from django.contrib.auth.models import User

from .models import Idea, Version
from django.core.mail import send_mail
from django.contrib.admin.helpers import ActionForm
from django import forms

# Register your models here.


class IdeaAdmin(admin.ModelAdmin):
    fieldsets = [
        (None, {'fields': ['user']}),
        (None, {'fields': ['request_text']}),
        (None, {'fields': ['description']}),
        (None, {'fields': ['version']}),
        ('Date information', {'fields': ['pub_date']}),
    ]
    list_display = ('user', 'request_text', 'pub_date', 'version', 'is_newest_version')
    list_filter = ['pub_date', 'version']
    search_fields = ['request_text', 'version']


def admin_mail(modeladmin, request, queryset):
    version = Version.objects.all().order_by('-id')[0]
    subject = request.POST['subject']
    if subject == '' or subject == 'a':
        subject = 'New Crowdjump version is online!'

    message = request.POST['message']
    if message == '' or message == 'a':
        message = 'Version ' + version.label + ' of Crowdjump is available now! \n ' \
                                         'Test it at https://crowdjump.win/website/phasergame'

    receivers = []
    for obj in queryset:
        receivers.append(obj.user.email)
    # for user in User.objects.all():
    #     receivers.append(user.email)

    send_mail(subject, message, 'crowdjump@gmail.com', receivers)


def reset_votes(modeladmin, request, queryset):
    for obj in queryset:
        obj.requests_left = 1
        obj.save


class MailForm(ActionForm):

    subject = forms.CharField(max_length=100)
    message = forms.CharField(max_length=100)


class MailAdmin(admin.ModelAdmin):
    action_form = MailForm
    actions = [admin_mail, reset_votes]

#
# class ResetVotes(admin.ModelAdmin):
#     actions = [reset_votes]

admin.site.register(Version)

# first unregister before using extended UserModel
admin.site.register(User, MailAdmin)

# admin.site.register(Player,ResetVotes)
admin.site.register(Idea, IdeaAdmin)
