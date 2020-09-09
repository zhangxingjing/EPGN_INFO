# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : insert_user.py
# Datetime : 2020/9/7 下午1:16

from insert_base import *
from users.models import User
from worktime.models import Laboratory

Laboratory.objects.create(name='四驱转鼓试验室', manage_user=User.objects.get(id=31))
Laboratory.objects.create(name='材料试验室', manage_user=User.objects.get(id=9))
Laboratory.objects.create(name='动刚度试验室', manage_user=User.objects.get(id=37))
Laboratory.objects.create(name='车身隔声试验室', manage_user=User.objects.get(id=26))
Laboratory.objects.create(name='动力总成试验室', manage_user=User.objects.get(id=19))
Laboratory.objects.create(name='前驱转鼓试验室', manage_user=User.objects.get(id=22))
Laboratory.objects.create(name='整车测试平台', manage_user=User.objects.get(id=10))
