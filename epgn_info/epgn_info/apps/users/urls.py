from . import views
from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    # 注册
    url(r'^users/$', views.UserView.as_view()),

    # jwt登录
    url(r'^authorizations/$', obtain_jwt_token),

    # 获取用户认证信息
    url('^user/$', views.UserDetailView.as_view()),

    # 用户修改密码
    url('^userinfo/$', views.user_info),

    # 自定义登录
    # url(r'^login/$', views.user_login),

    # 退出 ==> 前端js里处理（清空sessionStorage）
    # url(r'^logout/$', views.logout),
]
