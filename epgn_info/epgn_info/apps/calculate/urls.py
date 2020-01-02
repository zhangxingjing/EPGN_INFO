from . import views
from django.conf.urls import url

urlpatterns = [
    # 返回文件通道信息
    url(r'^channel/$', views.get_channel),

    # 返回文件列表 去重后的 通道列表和算法列表
    url(r'^channel_list/$', views.get_channel_list),

    # 返回 后台处理 的算法结果
    url(r'^calculate/$', views.calculate),
    # url(r'^calculate/$', views.ParseTask.as_view({"post": "parse_tasks"})),  # 使用类视图执行 多任务处理算法数据

    # 调用算法结果，直接返回数据
    url(r'^get_file_result/$', views.get_file_result),

    # return_file_list
    url(r'file_list/', views.return_file_list),

    # judge_file_channel
    url(r'judge_file_channel/', views.judge_file_channel),

    # autocalculate
    url(r'autocalculate/', views.autocalculate),
]
