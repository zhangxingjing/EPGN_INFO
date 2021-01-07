# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : serializers.py
# Datetime : 2020/11/2 下午3:02


from rest_framework import serializers
from rest_framework.serializers import ModelSerializer

from voice.models import Source, Voice, Status


class SourceSerializer(ModelSerializer):
    class Meta:
        model = Source
        fields = "__all__"


class StatusSerializer(ModelSerializer):
    class Meta:
        model = Status
        fields = "__all__"


# class FileSaveSerializer(ModelSerializer):
#     class Meta:
#         model = FileSave
#         fields = ("path",)


class VoiceSerializer(ModelSerializer):
    author = serializers.CharField(source="author.username")
    car_model = serializers.CharField(source="car_model.name")
    gearbox = serializers.CharField(source="gearbox.name")
    propulsion = serializers.CharField(source="propulsion.num")
    power = serializers.CharField(source="power.num")

    # gearbox = serializers.SerializerMethodField()
    # propulsion = serializers.SerializerMethodField()
    # power = serializers.SerializerMethodField()

    # file = FileSaveSerializer(many=True, read_only=True)

    class Meta:
        model = Voice
        fields = (
            "id",
            "author",
            "car_model",
            "propulsion",
            "gearbox",
            "power",
            "status",
            "source",
            "depict",
            "remark",
            "hdf",
            "img_1",
            "img_2",
            "mp3",
        )
        # fields = "__all__"

    def get_gearbox(self, obj):
        if obj.gearbox:
            return obj.gearbox
        else:
            return ""

    # def get_power(self, obj):
    #     if obj.power:
    #         obj.power = ""
    #     return obj.power
    #
    # def get_propulsion(self, obj):
    #     if obj.propulsion is None:
    #         obj.propulsion = ""
    #     return obj.propulsion
