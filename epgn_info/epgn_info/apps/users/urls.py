from . import views
from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    # 注册
    url(r'^users/$', views.UserView.as_view()),

    # jwt登录
    url(r'^authorizations/$', obtain_jwt_token),

    # 自定义登录
    url(r'^login/$', views.user_login),

    # 退出
    url(r'^logout/$', views.logout),

    # 用户个人中心
    url('^userinfo/$', views.user_info),
]
