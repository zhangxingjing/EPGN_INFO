from django.conf.urls import url, include
from django.contrib import admin
from django.views.generic.base import TemplateView, RedirectView
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    # 站点管理
    # url(r'^admin/', xadmin.site.urls, name="xadmin"),
    url(r'^admin/', admin.site.urls, name="admin"),

    # 显示图片的请求 ==> /favicon.ico
    url(r'^favicon\.ico$', RedirectView.as_view(url=r'static/image/favicon.ico')),

    # 这是直接访问IP时, 浏览器展示的页面 ==> templates文件夹中的文件
    # url(r'^$', TemplateView.as_view(template_name='index.html'), name='index'),
    url(r'^$', TemplateView.as_view(template_name='user/login.html'), name='login'),

    url(r'^authorization/$', obtain_jwt_token),
    # url(r'^authorization/$', jwt_response_payload_handler),

    url(r'user/', include('users.urls'), name="users"),

    url(r'test/', include('fileinfo.urls'), name="test"),

    url(r'calculate/', include('calculate.urls'), name="calculate"),

    url(r'audio/', include('audio.urls'), name="audio"),

    url(r'bug/', include('bug.urls'), name="bug"),

    url(r'time/', include('worktime.urls'), name="time"),

    url(r'script/', include('script.urls'), name="script"),

    url(r'voice/', include('voice.urls'), name="voice"),
]

handler404 = 'script.views.pageNotFound'

# 修改admin中的标题
admin.site.site_title = "EPGN_INFO 后台管理"
admin.site.site_header = "EPGN_INFO"
