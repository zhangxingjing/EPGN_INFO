import xadmin
from django.conf.urls import url, include
from rest_framework_jwt.views import obtain_jwt_token
from django.views.generic.base import TemplateView, RedirectView

urlpatterns = [
    # 站点管理
    url(r'^admin/', xadmin.site.urls, name="xadmin"),

    # 显示图片的请求 ==> /favicon.ico
    url(r'^favicon\.ico$', RedirectView.as_view(url=r'static/image/favicon.ico')),

    # 这是直接访问IP时, 浏览器展示的页面 ==> templates文件夹中的文件
    # url(r'^$', TemplateView.as_view(template_name='index.html'), name='index'),
    url(r'^$', TemplateView.as_view(template_name='user/login.html'), name='login'),

    url(r'^authorization/$', obtain_jwt_token),

    url(r'user/', include('users.urls')),

    url(r'test/', include('fileinfo.urls')),

    url(r'calculate/', include('calculate.urls')),

    url(r'audio/', include('audio.urls')),

    url(r'bug/', include('bug.urls'))
]
