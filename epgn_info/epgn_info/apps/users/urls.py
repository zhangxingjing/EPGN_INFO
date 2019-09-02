from . import views
from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    # jwt登录
    url(r'^authorizations/$', obtain_jwt_token),

    # 获取用户认证信息
    url('^user/$', views.UserDetailView.as_view()),

    # 用户修改密码
    url('^userinfo/$', views.user_info),
]
