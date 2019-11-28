from . import views
from django.conf.urls import url

urlpatterns = [
    # get file channel information
    url(r'^channel/$', views.get_file_header),

    # access algorithm
    url(r'^calculate/$', views.calculate),

    # call result
    url(r'^get_file_result/$', views.get_file_result),

    # get_channel_list
    url(r'^channel_list/$', views.get_channel_list),

    # return_file_list
    url(r'file_list/', views.return_file_list),

    # judge_file_channel
    url(r'judge_file_channel/', views.judge_file_channel),
]
