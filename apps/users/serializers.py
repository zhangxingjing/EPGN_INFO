from rest_framework import serializers
from .models import User, Task, Section, Direction


# 用户登录的序列化器
class AuthUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


# 用户详细信息序列化器
class UserDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # 指明参照哪个模型类
        fields = ('id', 'username', 'job_number', 'update_files_data', 'download_files_data', 'task')  # 指明为模型类的哪些字段生成


# 用户个人数据序列化器
class UserFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # 指明参照哪个模型类
        fields = "__all__"


# 用户任务的序列化器
class UserTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"


# 用户部门的序列化器
class SectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Section
        fields = "__all__"


# 用户专业方向的序列化器
class DirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direction
        fields = "__all__"
