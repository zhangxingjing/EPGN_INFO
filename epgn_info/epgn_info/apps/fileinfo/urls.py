from . import views
from django.conf.urls import url
from rest_framework.routers import SimpleRouter, DefaultRouter

urlpatterns = [
    # 检索 ==> 表格重载
    url(r'^car/$', views.file),

    # 文件上传
    url(r'^upload/$', views.upload),

    # 文件下载
    url(r'^download/(?P<pk>\d+)$', views.file_down),

    # 用户添加对比列表
    url(r'^contrast/$', views.SaveContrastView.as_view()),

    # 用户查看使用文档
    url(r'^word/$', views.word),

    # 访问模板渲染页面
    url(r'^base/(?P<pk>\d+)/$', views.parse_template)

]

# 使用rest_framework中的SimpleRouter方法,优化功率查询时候的url
# router = SimpleRouter()
# router.register('propulsionpower_num', views.PropulsionPowerView, base_name='propulsionpower_num')

# urlpatterns += router.urls
router = SimpleRouter()
# 搜索引擎的URL
router.register('fileinfo/search', views.FileSearchViewSet, base_name='fileinfo_search')
urlpatterns += router.urls
