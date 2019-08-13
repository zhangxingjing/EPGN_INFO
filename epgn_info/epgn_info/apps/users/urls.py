from . import views
from django.conf.urls import url
from .utils import *
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    url(r'^users/$', views.UserView.as_view()),  # 注册
    url(r'^authorizations/$', obtain_jwt_token),  # 登录
    url(r'^login/$', views.user_login),  # 登录
    url(r'^logout/$', views.logout),  # 退出
]
