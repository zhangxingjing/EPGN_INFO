from rest_framework import serializers
from .models import Audio, AudioStatus


# 返回的文件信息序列化器
class AudioSerializer(serializers.ModelSerializer):
    """指定返回的数据中有哪些字段"""

    class Meta:
        model = Audio  # 绑定对应的模型类
        fields = ["id", "description", "car_model", "propulsion", "power", "gearbox", "complaint_feature", "status", "author", "tire_model", "measures", "reason", "details", "raw_mp3", "img", "complain_mp3", "ppt"]

class AudioStatusSerializer(serializers.ModelSerializer):
    """返回抱怨音频中的工况信息"""

    class Meta:
        model = AudioStatus
        fields = ['id', 'name']

