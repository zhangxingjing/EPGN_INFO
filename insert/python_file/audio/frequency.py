# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : frequency.py
# Datetime : 2020/9/8 上午9:23

from insert_base import *
from audio.models import Frequency

Frequency.objects.create(id=1, name="<50")
Frequency.objects.create(id=2, name="50-100")
Frequency.objects.create(id=3, name="100-500")
Frequency.objects.create(id=4, name="500-1000")
Frequency.objects.create(id=5, name="1000-3000")
Frequency.objects.create(id=6, name=">3000")
