from rest_framework import serializers
from .models import PropulsionPower, Platform, Direction, Fileinfo, GearBox, Channel


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


# 返回变速箱信息的序列化器
class GearBoxSerializer(serializers.ModelSerializer):
    class Meta:
        model = GearBox  # 绑定对应的模型类
        fields = ["id", "name"]


# 返回的文件信息序列化器
class FileSerializer(serializers.ModelSerializer):
    """指定返回的数据中有哪些字段"""

    class Meta:
        model = Fileinfo  # 绑定对应的模型类
        fields = ["id", "carmodel", "author", "file_name", "platform", "produce", "parts", "status", "car_num",
                  "propulsion", "power", "other_need"]


# 用户数据的序列化器
class UserFileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Fileinfo
        fields = ['id', 'car_num', 'produce', 'status', 'file_name', 'other_need']


# 通道的序列化器
class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ["id", "name"]


# 通道名其他写法的序列化器
class OtherChannelSerializer(serializers.ModelSerializer):
    subs = ChannelSerializer(many=True, read_only=True)

    class Meta:
        model = Channel
        fields = ["id", "name", "subs"]


# 添加分类之后的通道信息
class ChannelCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = ["id", "name"]


class ChannelNameSerializer(serializers.ModelSerializer):
    subs = ChannelCategorySerializer(many=True, read_only=True)

    class Meta:
        model = Channel
        fields = ["id", "name", "subs"]


class OtherChannelNameSerializer(serializers.ModelSerializer):
    subs = ChannelNameSerializer(many=True, read_only=True)

    class Meta:
        model = Channel
        fields = ["id", "name", "subs"]
