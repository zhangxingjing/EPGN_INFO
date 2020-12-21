# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : urls.py
# Datetime : 2020/11/2 下午3:02

from django.conf.urls import url
from rest_framework.routers import DefaultRouter

from voice.views import VoiceViewSet, Wait, Detail, download

router = DefaultRouter()
router.register(r'', VoiceViewSet, basename="voice")

urlpatterns = [
    url(r'^download/$', download),
    url(r'^wait/$', Wait.as_view({"get": "get_items"}), name="wait"),
    url(r'^search/$', Wait.as_view({"get": "search"}), name="search"),
    url(r'^upload/$', Wait.as_view({"get": "upload"}), name="upload"),
    url(r'^compare/$', Wait.as_view({"get": "compare"}), name="compare"),
    url(r'^detail/$', Wait.as_view({"get": "voice_detail"}), name="detail"),

    url(r'^img/$', Detail.as_view({"get": "img"}), name="img"),
    url(r'^mp3/$', Detail.as_view({"get": "mp3"}), name="mp3"),
]

urlpatterns += router.urls
