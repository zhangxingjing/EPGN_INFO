# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : admin.py
# Datetime : 2020/10/26 下午1:34


from django.contrib import admin

from bug.models import *


class CategoryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name']
    search_fields = ['name', ]
    list_display_links = ['name', ]


class BugAdmin(admin.ModelAdmin):
    list_display = ["id", "updater", "level", "category", "developer", "content", "status"]
    search_fields = ["author", "category", "content", "status"]
    list_display_links = ["status"]


admin.site.register(Category, CategoryAdmin)
admin.site.register(Bug, BugAdmin)
