from . import views
from django.conf.urls import url

urlpatterns = [
    url(r'^fft/$', views.CalculateItem.as_view({'post': 'fft_info'})),  # 用户选择算法种类
]
