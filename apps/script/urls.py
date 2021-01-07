# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : urls.py
# Datetime : 2020/10/9 下午4:45

from .views import *
from django.conf.urls import url

urlpatterns = [
    url(r'^info/$', script_index, name="info"),
    url(r'^read_exce/$', read_excel, name="excel"),
    url(r'^download/$', download, name="download"),
    url(r'^change/$', change_file, name="change"),
]
