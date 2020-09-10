# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : urls.py
# Datetime : 2020/9/1 下午1:31


from .views import *
from django.conf.urls import url
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'^work', WorkTimeInfo)

urlpatterns = [

    url(r'^room/$', LaboratoryInfo.as_view({"get": "room"})),
    url(r'^room/(?P<id>\d+)/$', LaboratoryInfo.as_view({"get": "test_"})),

    url(r'^check/$', CheckWorkTime.as_view()),

    url(r'^save/$', save_xls_download),
]

urlpatterns += router.urls
