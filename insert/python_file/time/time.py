# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : time.py
# Datetime : 2020/9/7 下午4:10


from insert_base import *
from worktime.models import LaboratoryTime

LaboratoryTime.objects.create(time=0.5)
LaboratoryTime.objects.create(time=1)
LaboratoryTime.objects.create(time=2)
LaboratoryTime.objects.create(time=4)
LaboratoryTime.objects.create(time=6)
LaboratoryTime.objects.create(time=8)
LaboratoryTime.objects.create(time=None)
