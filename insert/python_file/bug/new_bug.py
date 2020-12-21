# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : new_bug.py
# Datetime : 2020/10/26 下午3:51


from insert_base import *
import time
from users.models import User
from bug.models import Bug, Category

Bug.objects.create(
    updater=User.objects.get(username="郑兴涛"),
    level=1,
    category=Category.objects.get(name="逻辑错误"),
    status=1,
    content="BUG",
    developer=1,
    create_time=time.strftime('%Y-%m-%d', time.localtime(time.time()))
)
