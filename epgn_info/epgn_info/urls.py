from django.contrib import admin
from django.conf.urls import url, include
from django.views.generic.base import TemplateView
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    # 站点管理
    url(r'^admin/', admin.site.urls),

    # 显示图片的请求 ==> /favicon.ico
    # 怎么做网页图标的显示

    # 用户访问需要登录
    url(r'^authorizations/$', obtain_jwt_token),  # 登录

    # url(r'^users/', include('users.urls')),
    url(r'', include('users.urls')),

    # 这是直接访问IP时, 浏览器展示的页面 ==> templates文件夹中的文件
    url(r'^$', TemplateView.as_view(template_name='login_2.html'), name='login'),
    # url(r'^$', TemplateView.as_view(template_name='index.html'), name='index'),

    # 车型的视图函数
    url(r'', include('fileinfo.urls')),

    # 算法视图
    url(r'^calculate/', include('calculate.urls')),

]
