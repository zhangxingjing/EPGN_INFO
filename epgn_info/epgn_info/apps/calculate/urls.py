from . import views
from django.conf.urls import url

urlpatterns = [
    # 获取文件通道信息
    url(r'^channel/$', views.get_file_header),

    # 访问算法
    url(r'^calculate/$', views.calculate),

    # 调用结果
    url(r'^get_file_result/$', views.get_file_result),
]
