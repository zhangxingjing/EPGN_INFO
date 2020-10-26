# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : admin.py
# Datetime : 2020/10/26 下午1:38


from django.contrib import admin

from worktime.models import *


class LaboratoryAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "name",
        "manager"
    ]
    search_fields = [
        'name',
        'manager'
    ]
    list_display_links = [
        'name'
    ]


class WorkTimeAdmin(admin.ModelAdmin):
    list_display = [
        "vin",
        "hours",
        "car_number",
        "task_title",
        "create_time",
        "task_manager",
        "task_user",
        "car_model",
        "check_data",
        "check_report",
        "check_task",
    ]


class DetailInfoAdmin(admin.ModelAdmin):
    list_display = [
        "hour",
        "name",
        "color",
        "role",
        "detail",
        "category",
        "laboratory",
        "parent",
    ]


admin.site.register(Laboratory, LaboratoryAdmin)
admin.site.register(WorkTask, WorkTimeAdmin)
admin.site.register(TaskDetail, DetailInfoAdmin)
