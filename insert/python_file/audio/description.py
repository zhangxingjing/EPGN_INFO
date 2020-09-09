# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : description.py
# Datetime : 2020/9/8 上午9:23


from insert_base import *
from audio.models import Description

Description.objects.create(name="Brummen")
Description.objects.create(name="Pfeifen")
Description.objects.create(name="Heulen")
Description.objects.create(name="Jaulen")
Description.objects.create(name="Schnarren")
Description.objects.create(name="Rasseln")
Description.objects.create(name="Heckraeusch")
Description.objects.create(name="Rollgeraeusch")
Description.objects.create(name="Torus")
Description.objects.create(name="Start/stop")
Description.objects.create(name="Motor Rauh/laut/present")
Description.objects.create(name="Bodyboom")
Description.objects.create(name="Vibration")
Description.objects.create(name="其他")
