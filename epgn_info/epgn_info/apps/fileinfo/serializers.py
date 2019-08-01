from rest_framework import serializers
from .models import PropulsionPower, Platform, Direction, Fileinfo


# 动力总成的序列化器
class PropulsionSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropulsionPower
        fields = ["id", "num"]


# 功率输出的序列化器
class PowerSerializer(serializers.ModelSerializer):
    subs = PropulsionSerializer(many=True, read_only=True)

    class Meta:
        model = PropulsionPower
        fields = ["id", "num", "subs"]


# 平台的序列化器
class PlatformSerializer(serializers.ModelSerializer):
    class Meta:
        model = Platform
        fields = ["id", "name"]


# 车型的序列化器
class CarModelSerializer(serializers.ModelSerializer):
    subs = PlatformSerializer(many=True, read_only=True)

    class Meta:
        model = Platform
        fields = ["id", "name", "subs"]


# 专业方向的序列化器
class DirectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Direction
        fields = ["id", "name"]


# 零部件的序列化器
class PartsWorkSerializer(serializers.ModelSerializer):
    subs = DirectionSerializer(many=True, read_only=True)

    class Meta:
        model = Direction
        fields = ["id", "name", "subs"]


# cookie存储的序列化器
class ContrasCartSerializer(serializers.ModelSerializer):
    file_name = serializers.IntegerField(label='文件名', read_only=True)

    class Meta:
        model = Fileinfo
        fields = ['id', 'file_name']
