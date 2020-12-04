# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : source.py
# Datetime : 2020/11/5 上午9:33


from insert_base import *
from voice.models import Source

Source.objects.create(id=1, name='动力总成')
Source.objects.create(id=2, name='进排气系统')
Source.objects.create(id=3, name='法规噪声')
Source.objects.create(id=4, name='辅助总成')
Source.objects.create(id=5, name='底盘')
Source.objects.create(id=6, name='车身')
