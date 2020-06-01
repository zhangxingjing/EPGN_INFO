# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author    : Zheng Xingtao
# File      : urls.py
# Datetime  : 2020/6/1 上午9:53

from .views import *
from django.conf.urls import url
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
# router.register(r'^user_name', UserInfoViewSet)

urlpatterns = [
    # 上传
    url(r'^audio_upload/$', audio_upload),
]

urlpatterns += router.urls
