from django.core.mail import send_mail, send_mass_mail, EmailMultiAlternatives
from authentication import models
import os
from email.mime.image import MIMEImage


def logo_data(path):
    with open(path, 'rb') as f:
        data = f.read()
    logo = MIMEImage(data)
    logo.add_header('Content-ID', '<logo>')
    return logo


def mail_new_version(request):
    username = ''
    if request.user.is_authenticated:
        username = request.user.username
    if username != 'admin':
        return 'Wrong User'

    BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    folder_path = os.path.join(BASE_DIR, 'Screenshots')

    screenshot_path = os.path.join(folder_path, '030.JPG')



    version = 'version 0.30'
    subject = 'Crowdjump got a new look!'
    message1 = 'Hello '
    message2 = ',<br>check out the new features of Crowdjump ' + version + '! There are '
    feature = "new deco elements, an explanation of all items and it's day or night in the game, depending on when you play!"
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
        msg.attach(logo_data(screenshot_path))
        msg.send()

    # final_message = message1 + 'admin' + message2 + feature + message3 + html_content + unsubscribe
    # msg = EmailMultiAlternatives(subject, '', fromMail, ['freshkd2@web.de'])
    # msg.attach_alternative(final_message, "text/html")
    # msg.attach(logo_data(screenshot_path))
    # msg.send()

    return 'Mail send'
