# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : urls.py
# Datetime : 2020/6/1 上午9:53

from .views import *
from django.conf.urls import url
from rest_framework.routers import DefaultRouter

app_name = "time"

router = DefaultRouter()
router.register(r'^file', AudioViewSet, basename="file")  # audio文件

urlpatterns = [
    url(r'^download/$', download),
    url(r'^wait/$', Wait.as_view({"get": "get_items"}), name="wait"),
    url(r'^search/$', Wait.as_view({"get": "search"}), name="search"),
    url(r'^upload/$', Wait.as_view({"get": "upload"}), name="upload"),
    url(r'^detail/$', Wait.as_view({"get": "audio_detail"}), name="detail"),

    url(r'^img/$', Detail.as_view({"get": "img"}), name="img"),
    url(r'^mp3/$', Detail.as_view({"get": "mp3"}), name="mp3"),

    # url(r'^search/$', search),
    # url(r'^upload/$', upload),
]

urlpatterns += router.urls
