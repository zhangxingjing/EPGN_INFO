from . import views
from django.conf.urls import url

urlpatterns = [
    # process channel information for all data
    url(r'^parse_channel/$', views.parse_data_channel),
]
