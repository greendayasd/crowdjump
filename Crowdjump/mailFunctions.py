from django.core.mail import send_mail, send_mass_mail, EmailMultiAlternatives
from authentication import models


def mail_new_version(request):
    username = ''
    if request.user.is_authenticated:
        username = request.user.username
    if username != 'admin':
        return 'Wrong User'

    version = 'version 0.22'
    subject = 'Crowdjump just got a little more tricky in ' + version + '!'
    message1 = 'Hello '
    message2 = ',<br>check out ' + version + ' of Crowdjump, the newest feature are '
    feature = "gates and spawnable platforms which only activate, when you press a specific button! Also the levels got a bit longer."
    message3 = '<br>To play the game, vote for ideas or submit your own, visit  '
    html_content = '<a href="https://www.crowdjump.win">Crowdjump.win :)</a>'
    unsubscribe = '<br><br><a href="https://www.crowdjump.win/unsubscribe">Click here if you dont want to get this newsletter anymore</a>'
    fromMail = 'crowdjump@gmail.com'

    for user in models.Account.objects.all():
        if not user.email_notification:
            print(user.username)
            continue

        final_message = message1 + user.username + message2 + feature + message3 + html_content + unsubscribe
        msg = EmailMultiAlternatives(subject, '', fromMail, [user.email])
        msg.attach_alternative(final_message, "text/html")
        msg.send()

    # final_message = message1 + 'admin' + message2 + feature + message3 + html_content
    # msg = EmailMultiAlternatives(subject, '', fromMail, ['freshkd2@web.de'])
    # msg.attach_alternative(final_message, "text/html")
    # msg.send()

    return 'Mail send'
