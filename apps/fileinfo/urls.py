from .views import *
from django.conf.urls import url
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'^channel', ChannelViewSet)

urlpatterns = [
    # 访问模板渲染页面
    url(r'^datainfo/(?P<pk>\d+)/$', DataInfo.as_view()),

    # 文件检索
    url(r'^search/$', Search.as_view()),

    # 文件上传
    url(r'^upload/$', Upload.as_view()),

    # 帮助文档
    url(r'^help/$', Word.as_view()),

    # 文件下载
    url(r'^download/(?P<pk>\d+)/$', Download.as_view()),

    # 修改文件状态
    url(r'^file_status/$', change_file_status),

    # 获取变速箱信息
    url(r'gearbox/$', GearBoxView.as_view({'get': 'get_gearbox'})),

    # 删除文件
    url(r'delete_file/$', delete_file),

    # # 修改通道
    # # url(r'^channel/$', )
    #
    # # 获取通道-专业方向
    # url(r'^channel_direction/$', ChannelView.as_view({'get': 'parts'})),
    #
    # # 通过专业方向获取通道
    # url(r'^channel_direction/(?P<pk>\d+)/$', ChannelView.as_view({'get': 'channel'})),

    # 获取所有其他通道
    # url(r'^other_channel/(?P<pk>\d+)/$', ChannelView.as_view({'get': 'other_channel'})),

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
]

urlpatterns += router.urls
