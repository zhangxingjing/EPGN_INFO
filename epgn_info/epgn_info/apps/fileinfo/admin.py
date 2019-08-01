from django.contrib import admin
from .models import Fileinfo, PropulsionPower, Platform, Direction


# 车辆数据信息
@admin.register(Fileinfo)
class FileInfoAdmin(admin.ModelAdmin):
    list_display = ['id', 'file_name', 'platform', 'carmodel', 'parts', 'status', 'author', 'car_num', 'propulsion',
                    'power', 'create_date', 'other_need']  # 页面上展示的用户数据
    search_fields = ['username', 'file_name', ]  # 可以搜索的字段
    list_display_links = ['file_name', ]


# 动力总成-功率
@admin.register(PropulsionPower)
class PropulsionPowerAdmin(admin.ModelAdmin):
    list_display = ['id', 'parent', 'num']
    list_display_links = ['parent']


# 平台-车型
@admin.register(Platform)
class PlatformAdmin(admin.ModelAdmin):
    list_display = ['id', 'parent', 'name']
    list_display_links = ['parent']


# 专业方向
@admin.register(Direction)
class DirectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'parent', 'name']
    list_display_links = ['parent']
