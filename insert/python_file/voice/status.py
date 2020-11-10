# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : status.py
# Datetime : 2020/11/5 上午9:35


from insert_base import *
from voice.models import Status

Status.objects.create(id=1, name='加/减速')
Status.objects.create(id=2, name='匀速')
Status.objects.create(id=3, name='滚动噪声/轮胎噪声')
Status.objects.create(id=4, name='怠速')
Status.objects.create(id=5, name='启停')
Status.objects.create(id=6, name='底盘舒适性')
Status.objects.create(id=7, name='静态(附件噪声)')
Status.objects.create(id=8, name='其他')
