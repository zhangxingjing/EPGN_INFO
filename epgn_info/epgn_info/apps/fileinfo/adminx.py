import xadmin
from django.contrib import admin
from .models import Fileinfo, PropulsionPower, Platform, Direction


# Vehicle data information
@xadmin.sites.register(Fileinfo)
class FileInfoAdmin():
    list_display = ['id', 'file_name', 'platform', 'carmodel', 'direction', 'parts', 'status', 'produce', 'author', 'car_num', 'propulsion',
                    'power', 'create_date', 'other_need']  # user data displayed on the page
    search_fields = ['username', 'file_name', ]  # fields that can be searched
    list_display_links = ['file_name', ]


# Powertrain - power
@xadmin.sites.register(PropulsionPower)
class PropulsionPowerAdmin():
    list_display = ['id', 'parent', 'num']
    list_display_links = ['parent']


# Platform - model
@xadmin.sites.register(Platform)
class PlatformAdmin():
    list_display = ['id', 'parent', 'name']
    list_display_links = ['parent']


# professional direction
@xadmin.sites.register(Direction)
class DirectionAdmin():
    list_display = ['id', 'parent', 'name']
    list_display_links = ['parent']
