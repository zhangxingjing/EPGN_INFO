from . import views
from django.conf.urls import url

urlpatterns = [
    # 获取文件通道信息
    url(r'^channel/$', views.get_file_header),

    # 访问算法
    url(r'^calculate/$', views.calculate),

    # 使用FFT
    url(r'^fft/$', views.run_fft),

    # 使用内部噪声
    url(r'^inner/$', views.run_inner),
]
