from django.core.mail import send_mail, send_mass_mail, EmailMultiAlternatives
from authentication import models


def mail_new_version(request):
    username = ''
    if request.user.is_authenticated:
        username = request.user.username
    if username != 'admin':
        return 'Wrong User'

    version = 'version 0.13'
    subject = 'Crowdjump ' + version + ' is available!'
    message1 = 'Hello '
    message2 = ',<br>check out ' + version + ' of Crowdjump, '
    feature = 'your final time will now not include the time your failed tries! Now its easier than ever to get a good time, try our best!'
    message3 = '<br>If you want your own idea to be implemented, '
    html_content = '<a href="https://www.crowdjump.win">submit an idea or vote for it at Crowdjump :)</a>'
    fromMail = 'crowdjump@gmail.com'

    for user in models.Account.objects.all():
        final_message = message1 + user.username + message2 + feature + message3 + html_content
        msg = EmailMultiAlternatives(subject, '', fromMail, [user.email])
        msg.attach_alternative(final_message, "text/html")
        msg.send()

    # final_message = message1 + 'admin' + message2 + feature + message3 + html_content
    # msg = EmailMultiAlternatives(subject, '', fromMail, ['freshkd2@web.de'])
    # msg.attach_alternative(final_message, "text/html")
    # msg.send()

    return 'Mail send'
