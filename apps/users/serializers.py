from .models import User, Task
from rest_framework import serializers


# 用户
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


# 任务
class UserTaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = "__all__"
