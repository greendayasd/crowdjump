"""
ASGI entrypoint. Configures Django and then runs the application
defined in the ASGI_APPLICATION setting.
"""


import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Crowdjump.settings")

from channels.routing import get_default_application
#import channels.asgi
#channel_layer = channels.asgi.get_channel_layer()

# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Crowdjump.settings")
django.setup()
application = get_default_application()