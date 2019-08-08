from . import views
from django.conf.urls import url

urlpatterns = [
    url(r'^fft/$', views.run_fft),  # 用户选择算法种类
    url(r'^inner/$', views.run_inner)
]
