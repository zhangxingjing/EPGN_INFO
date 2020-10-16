# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : serializers.py
# Datetime : 2020/9/3 下午3:32


from users.models import User
from rest_framework import serializers
from .models import Laboratory, WorkTask, TaskDetail


class LaboratorySerializer(serializers.ModelSerializer):
    # 使用这种方法，在这里获取当前外键的属性值
    manager_name = serializers.CharField(source='manager.username')

    class Meta:
        model = Laboratory
        fields = "__all__"


class ManageSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username"]


class WorkTaskSerializer(serializers.ModelSerializer):
    check_task = serializers.SerializerMethodField()
    car_model = serializers.CharField(source='car_model.name', read_only=True)
    task_manager = serializers.CharField(source='task_manager.username', read_only=True)

    class Meta:
        model = WorkTask
        fields = "__all__"

    def get_check_task(self, data):
        if data.check_task == 1:
            return '未审核'
        elif data.check_task == 2:
            return '已通过'
        elif data.check_task == 3:
            return '未通过'


class TaskDetailSerializer(serializers.ModelSerializer):
    # 自定义返回的数据
    role = serializers.SerializerMethodField()
    color = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    task_manager = serializers.SerializerMethodField()
    laboratory = serializers.CharField(source='laboratory.name', read_only=True)

    class Meta:
        model = TaskDetail
        fields = "__all__"

    def get_color(self, data):
        if data.color == 1:
            return "1"
        elif data.color == 2:
            return "2"

    def get_role(self, data):
        if data.role == 1:
            return "R"
        elif data.role == 2:
            return "S"
        elif data.role == 3:
            return "M"

    def get_category(self, data):
        if data.category == 1:
            return "测试"
        elif data.category == 2:
            return "管理"

    def get_task_manager(self, data):
        test_manage = data.task_manager.all()
        user_list = ManageSerializer(test_manage, many=True).data
        return [user["username"] for user in user_list]

    def update(self, instance, validated_data):
        # TODO： 这里为什么只能获取到两个参数！
        instance.parent.check_task = int(validated_data.get("hour"))
        instance.parent.save()

        task = instance.parent.task
        task.delete()

        return instance
