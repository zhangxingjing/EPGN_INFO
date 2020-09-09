# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : serializers.py
# Datetime : 2020/9/3 下午3:32


from rest_framework import serializers
from users.models import User
from .models import Laboratory, WorkTime, TestContent


class LaboratorySerializer(serializers.ModelSerializer):
    # 使用这种方法，在这里获取当前外键的属性值
    manage_username = serializers.CharField(source='manage_user.username')

    class Meta:
        model = Laboratory
        fields = ["id", "name", "manage_username"]


class ManageSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username"]


class TestContentSerializer(serializers.ModelSerializer):
    manage = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    default_role = serializers.SerializerMethodField()
    title_name = serializers.CharField(source='title.name', read_only=True)
    time_time = serializers.CharField(source='time.time', read_only=True)

    class Meta:
        model = TestContent
        fields = ["id", "name", "category", "default_role", "title_name", "time_time", "manage"]

    def get_manage(self, data):
        test_manage = data.task_manage.all()
        user_list = ManageSerializer(test_manage, many=True).data
        return [user["username"] for user in user_list]

    def get_category(self, data):
        if data.category == 1:
            return "测试"
        elif data.category == 2:
            return "管理"

    def get_default_role(self, data):
        if data.default_role == 1:
            return "R"
        elif data.default_role == 2:
            return "S"
        elif data.default_role == 3:
            return "M"


class WorkTimeSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkTime
        fields = "__all__"
