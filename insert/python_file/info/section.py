# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : section.py
# Datetime : 2020/9/8 上午9:30


from insert_base import *
from users.models import Section

Section.objects.create(name="EPGN")
Section.objects.create(name="EPGN-1", direction="声学验证和大数据分析")
Section.objects.create(name="EPGN-2", direction="动力总成声学")
Section.objects.create(name="EPGN-3", direction="车身底盘声学")
Section.objects.create(name="EPGN-4", direction="声学项目")
Section.objects.create(name="TEST")
Section.objects.create(name="TF")
