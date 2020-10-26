# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : admin.py
# Datetime : 2020/10/26 下午1:33

from django.contrib import admin

from .models import *


class DescriptionAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name', ]
    list_display_links = ['name', ]


class FrequencyAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name', ]
    list_display_links = ['name', ]


class StatusAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name', ]
    list_display_links = ['name', ]


class AudioAdmin(admin.ModelAdmin):
    list_display = ['id', 'description', 'frequency', 'status', 'details', 'detail_from', 'order', 'reason', 'measures', 'car_model', 'propulsion', 'gearbox', 'power', 'tire_model', 'author', 'mp3', 'img', 'mp3', 'ppt']
    search_fields = ['description', ]
    list_display_links = ['description', ]


admin.site.register(Description, DescriptionAdmin)
admin.site.register(Frequency, FrequencyAdmin)
admin.site.register(Status, StatusAdmin)
admin.site.register(Audio, AudioAdmin)
