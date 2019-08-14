from . import views
from django.conf.urls import url

urlpatterns = [
    # 访问算法
    url(r'^$', views.calculate),

    # 使用FFT
    url(r'^fft/$', views.run_fft),  # 用户选择算法种类

    # 使用内部噪声
    url(r'^inner/$', views.run_inner)
]
