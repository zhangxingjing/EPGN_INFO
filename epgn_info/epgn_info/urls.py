import xadmin
from django.contrib import admin
from django.conf.urls import url, include
from django.views.generic.base import TemplateView, RedirectView
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    # 站点管理
    url(r'^admin/', xadmin.site.urls, name="xadmin"),

    # 显示图片的请求 ==> /favicon.ico
    url(r'^favicon\.ico$', RedirectView.as_view(url=r'epgn_front_end/image/favicon.ico')),

    # 这是直接访问IP时, 浏览器展示的页面 ==> templates文件夹中的文件
    url(r'^$', TemplateView.as_view(template_name='index.html'), name='index'),
    # url(r'^$', TemplateView.as_view(template_name='login.html'), name='login'),

    # 用户访问需要登录
    url(r'^authorizations/$', obtain_jwt_token),

    # 用户
    url(r'', include('users.urls')),

    # 汽车数据
    url(r'', include('fileinfo.urls')),

    # 算法
    url(r'', include('calculate.urls')),
]
