from .views import *
from django.conf.urls import url
from rest_framework_jwt.views import obtain_jwt_token
from rest_framework.routers import SimpleRouter, DefaultRouter

router = DefaultRouter()
router.register(r'^user_name', UserInfoViewSet)

urlpatterns = [
    # jwt登录
    url(r'^authorizations/$', obtain_jwt_token),

    # 获取用户认证信息
    url('^user/$', UserDetailView.as_view()),

    # 退出登录
    url('^logout/$', LogoutView.as_view()),

    # 用户修改密码
    # url('^user_info/$', UserInfoViewSet.as_view()),

    # 返回home
    url('^home/$', home),
]

urlpatterns += router.urls
