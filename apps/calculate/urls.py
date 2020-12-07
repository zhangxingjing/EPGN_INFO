from django.conf.urls import url

from .views import *

urlpatterns = [

    # 返回通道信息
    url(r'^channellist/$', ChannelList.as_view()),

    # 返回算法结果
    url(r'^parse/$', CalculateParse.as_view()),

    # return_file_list
    url(r'file_list/', return_file_list),

    # auto_calculate
    url(r'auto/', auto_calculate),

    # 处理PPT
    url('^parse_ppt/$', PPTParse.as_view()),

    # 跳转扉页
    url('^test_page/$', test_page),

    # 手动报告
    url('^user_calculate/$', manual_report),

]
