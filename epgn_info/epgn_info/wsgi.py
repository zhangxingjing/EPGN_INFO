import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "epgn_info.epgn_info.settings.dev")
# os.environ.setdefault("DJANGO_SETTINGS_MODULE", "epgn_info.epgn_info.settings.pro")
application = get_wsgi_application()
