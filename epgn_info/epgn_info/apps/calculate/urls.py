from .views import *
from django.conf.urls import url

urlpatterns = [

    # 通道信息
    url(r'^channelList/$', ChannelList.as_view()),

    # 返回 后台处理 的算法结果
    url(r'^calculate/$', CalculateParse.as_view()),

    # return_file_list
    url(r'file_list/', return_file_list),

    # autocalculate
    url(r'autocalculate/', auto_calculate),

    # 处理PPT
    url('^parse_ppt/$', PPTParse.as_view()),

]
