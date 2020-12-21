# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : admin.py
# Datetime : 2020/10/26 下午1:37


from django.contrib import admin

from users.models import *


class UserAdmin(admin.ModelAdmin):
    def post_count(self, obj):
        return obj.task.count()

    post_count.short_description = "待办事项"
    list_display = ('id', 'username', "job_number", 'update_files_data', 'views', 'download_files_data',
                    'post_count', 'section', 'phone', 'last_login',)  # 这里显示的是修改数据之后后台可以看到的页面中的数据
    fields = ("username", "job_number", 'password', 'section', 'phone', 'task',
              'is_superuser',)  # 这是用户添加数据的时候可以看到的页面
    list_display_links = ('username', 'job_number',)  # 用来配置哪些字段可以作为链接, 点击他们可以进入编辑页面
    search_fields = ('username', 'job_number', 'phone', 'section',)


# 任务信息
class TaskAdmin(admin.ModelAdmin):
    list_display = ('id', 'name',)


# 部门信息
class SectionAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'direction')


admin.site.register(Task, TaskAdmin)
admin.site.register(Section, SectionAdmin)
admin.site.register(User, UserAdmin)
