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

    # 获取平台
    url(r'^car_platform/$', views.PlatformCarModelView.as_view({'get': 'platform'})),

    # 获取所有车型
    url(r'^car_model/$', views.PlatformCarModelView.as_view({'get': 'every_platform'})),

    # 获取车型
    url(r'^car_model/(?P<pk>\d+)$', views.PlatformCarModelView.as_view({'get': 'car_model'})),

    # 获取动力总成
    url(r'^propulsionpower_num/$', views.PropulsionPowerView.as_view({'get': 'propulsion'})),

    # 获取功率
    url(r'^propulsionpower_num/(?P<pk>\d+)/$', views.PropulsionPowerView.as_view({'get': 'power'})),

    # 获取所有功率
    url(r'^power/$', views.PropulsionPowerView.as_view({'get': 'every_power'})),

    # 获取专业方向
    url(r'^direction_num/$', views.DirectionView.as_view({'get': 'parts'})),

    # 获取零部件和工况
    url(r'^direction_num/(?P<pk>\d+)/$', views.DirectionView.as_view({'get': 'power'})),

    # 用户添加对比列表
    url(r'^contrast/$', views.SaveContrastView.as_view()),

    # 用户查看使用文档
    url(r'^word/$', views.word),

    # 访问模板渲染页面
    url(r'^base/(?P<pk>\d+)/$', views.parse_template),

    # 用户撤销文件上传
    url(r'^cancel/$', views.cancel),

    # ele
]

# 使用rest_framework中的SimpleRouter方法,优化功率查询时候的url
# router = SimpleRouter()
# router.register('propulsionpower_num', views.PropulsionPowerView, base_name='propulsionpower_num')

# urlpatterns += router.urls
router = SimpleRouter()
# 搜索引擎的URL
router.register('fileinfo/search', views.FileSearchViewSet, base_name='fileinfo_search')
urlpatterns += router.urls
