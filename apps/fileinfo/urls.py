from .views import *
from django.conf.urls import url
from rest_framework.routers import SimpleRouter, DefaultRouter

router = SimpleRouter()
router.register(r'parse_file', FileInfoViewSet)

urlpatterns = [
    # 检索 ==> 表格重载
    # url(r'^car/$', file),

    # 文件上传及通道修改
    # url(r'^upload/$', upload),
    url(r'^upload/$', ParseFile.as_view()),

    # 文件下载
    url(r'^download/(?P<pk>\d+)/$', file_down),

    # 用户查看使用文档
    url(r'^word/$', word),

    # check文件通道信息
    url(r'channel_check/$', CheckChannel.as_view()),

    # 访问模板渲染页面
    url(r'^base/(?P<pk>\d+)/$', parse_template),

    # 修改文件状态
    url(r'^file_status/$', change_file_status),

    # 用户添加对比列表
    # url(r'^contrast/$', SaveContrastView.as_view()),

    # 用户撤销文件上传
    url(r'^delete_file/$', delete_file),

    # 获取"当前用户"上传的数据信息
    # url(r'user_file_info/$', user_file_info),

    # 获取平台
    url(r'^car_platform/$', PlatformCarModelView.as_view({'get': 'platform'})),

    # 获取所有车型
    url(r'^car_model/$', PlatformCarModelView.as_view({'get': 'every_platform'})),

    # 获取车型
    url(r'^car_model/(?P<pk>\d+)$', PlatformCarModelView.as_view({'get': 'car_model'})),

    # 获取动力总成
    url(r'^propulsionpower_num/$', PropulsionPowerView.as_view({'get': 'propulsion'})),

    # 获取功率
    url(r'^propulsionpower_num/(?P<pk>\d+)/$', PropulsionPowerView.as_view({'get': 'power'})),

    # 获取所有功率
    url(r'^power/$', PropulsionPowerView.as_view({'get': 'every_power'})),

    # 获取专业方向
    url(r'^direction_num/$', DirectionView.as_view({'get': 'parts'})),

    # 获取零部件和工况
    url(r'^direction_num/(?P<pk>\d+)/$', DirectionView.as_view({'get': 'power'})),

    # 获取变速箱信息
    url(r'gearbox/$', GearBoxView.as_view({'get': 'get_gearbox'})),
]

urlpatterns += router.urls
