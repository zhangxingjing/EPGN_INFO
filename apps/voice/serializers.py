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


class VoiceSerializer(ModelSerializer):
    author = serializers.CharField(source="author.username")
    car_model = serializers.CharField(source="car_model.name")
    gearbox = serializers.CharField(source="gearbox.name")
    propulsion = serializers.CharField(source="propulsion.num")
    power = serializers.CharField(source="power.num")

    class Meta:
        model = Voice
        fields = "__all__"
