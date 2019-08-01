from django.contrib import admin
from django.conf.urls import url, include
from django.views.generic.base import TemplateView

urlpatterns = [
    # 站点管理
    url(r'^admin/', admin.site.urls),

    # 显示图片的请求 ==> /favicon.ico
    # 怎么做网页图标的显示

    # url(r'^users/', include('users.urls')),
    url(r'', include('users.urls')),

    # 这是直接访问IP时, 浏览器展示的页面
    # url(r'^$', TemplateView.as_view(template_name='login.html'), name='index'),
    url(r'^$', TemplateView.as_view(template_name='index.html'), name='index'),

    # 车型的视图函数
    url(r'', include('fileinfo.urls')),

    # 算法视图
    url(r'^calculate/', include('calculate.urls')),

]
