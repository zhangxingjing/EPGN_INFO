from rest_framework_jwt.views import obtain_jwt_token

from . import views
from django.conf.urls import url

urlpatterns = [
    url(r'^users/$', views.UserView.as_view()),  # 注册
    url(r'^authorizations/$', obtain_jwt_token),  # 登录
]
