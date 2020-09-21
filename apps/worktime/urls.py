# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : urls.py
# Datetime : 2020/9/1 下午1:31


from .views import *
from django.conf.urls import url
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'^work', WorkTaskViewSet)
router.register(r'^task', TaskDetailView)
router.register(r'^check', CheckWorkTime)

urlpatterns = [

    url(r'^room/$', LaboratoryViewSet.as_view({"get": "room"})),
    url(r'^room/(?P<id>\d+)/$', LaboratoryViewSet.as_view({"get": "info"})),

    url(r'^submit/$', WaitViewSet.as_view({"get": "submit"})),
    url(r'^search/$', WaitViewSet.as_view({"get": "search"})),
    url(r'^item/$', WaitViewSet.as_view({"get": "get_items"})),

    url(r'^save/$', save_xls_download),
]

urlpatterns += router.urls
