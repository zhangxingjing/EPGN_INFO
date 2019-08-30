import xadmin
from django.contrib import admin
from .models import Fileinfo, PropulsionPower, Platform, Direction


# 车辆数据信息
@xadmin.sites.register(Fileinfo)
class FileInfoAdmin():
    list_display = ['id', 'file_name', 'platform', 'carmodel', 'direction', 'parts', 'status', 'produce', 'author', 'car_num', 'propulsion',
                    'power', 'create_date', 'other_need']  # 页面上展示的用户数据
    search_fields = ['username', 'file_name', ]  # 可以搜索的字段
    list_display_links = ['file_name', ]


# 动力总成-功率
@xadmin.sites.register(PropulsionPower)
class PropulsionPowerAdmin():
    list_display = ['id', 'parent', 'num']
    list_display_links = ['parent']


# 平台-车型
@xadmin.sites.register(Platform)
class PlatformAdmin():
    list_display = ['id', 'parent', 'name']
    list_display_links = ['parent']


# 专业方向
@xadmin.sites.register(Direction)
class DirectionAdmin():
    list_display = ['id', 'parent', 'name']
    list_display_links = ['parent']