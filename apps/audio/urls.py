# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author    : Zheng Xingtao
# File      : urls.py
# Datetime  : 2020/6/1 上午9:53

from .views import *
from django.conf.urls import url
from rest_framework.routers import DefaultRouter

router = DefaultRouter()

urlpatterns = [
    # 抱怨工况
    url(r'^audio_status/$', audio_status),

    # 下载抱怨
    url(r'^audio_download/(?P<pk>\d+)$', audio_download)
]

router.register(r'^audio', AudioViewSet)
urlpatterns += router.urls
