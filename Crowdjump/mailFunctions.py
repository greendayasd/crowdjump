from django.core.mail import send_mail, send_mass_mail, EmailMultiAlternatives
from authentication import models

def mail_new_version(request):
    username = ''
    if request.user.is_authenticated:
        username = request.user.username
    if username != 'admin':
        return 'Wrong User'

    subject = 'Crowdjump version 0.02 is available!'
    message1 = 'Hello '
    message2 = ',<br>check out version 0.02 of Crowdjump, the newest feature is lava!<br>If you want your own idea to be implemented, submit an idea :)<br><br>'
    html_content = '<a href="https://www.crowdjump.win">Click here to visit Crowdjump</a>'
    fromMail = 'crowdjump@gmail.com'

    for user in models.Account.objects.all():
        final_message = message1 + user.username + message2 + html_content
        msg = EmailMultiAlternatives(subject, '', fromMail, [user.email])
        msg.attach_alternative(final_message, "text/html")
        msg.send()


    return 'Hello'
