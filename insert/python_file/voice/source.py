# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : source.py
# Datetime : 2020/11/5 上午9:33


from insert_base import *
from voice.models import Source

Source.objects.create(id=1, name='轮胎')
Source.objects.create(id=2, name='整车')
Source.objects.create(id=3, name='空调')
Source.objects.create(id=4, name='天窗')
Source.objects.create(id=5, name='引擎')
