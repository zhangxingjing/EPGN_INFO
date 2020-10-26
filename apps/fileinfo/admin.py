# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : admin.py
# Datetime : 2020/10/26 下午1:36


from django.contrib import admin

from fileinfo.models import *

from .models import Fileinfo, PropulsionPower, Platform, Direction, Channel


class FileInfoAdmin(admin.ModelAdmin):
    list_display = ['id', 'file_name', 'platform', 'carmodel', 'direction', 'parts', 'status', 'produce', 'author', 'car_num', 'propulsion', 'power', 'create_date', 'other_need']  # user data displayed on the page
    search_fields = ['username', 'file_name', ]  # fields that can be searched
    list_display_links = ['file_name', ]


class PropulsionPowerAdmin(admin.ModelAdmin):
    list_display = ['id', 'parent', 'num']
    list_display_links = ['parent']


class PlatformAdmin(admin.ModelAdmin):
    list_display = ['id', 'parent', 'name']
    list_display_links = ['parent']


class DirectionAdmin(admin.ModelAdmin):
    list_display = ['id', 'parent', 'name']
    list_display_links = ['parent']


class ChannelAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'parent']
    list_display_links = ['name']
    search_fields = ['name', 'parent', ]  # fields that can be searched


admin.site.register(Fileinfo, FileInfoAdmin)
admin.site.register(PropulsionPower, PropulsionPowerAdmin)
admin.site.register(Platform, PlatformAdmin)
admin.site.register(Direction, DirectionAdmin)
admin.site.register(GearBox)
admin.site.register(Channel, ChannelAdmin)
