# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : category.py
# Datetime : 2020/10/26 下午3:48

from insert_base import *
from bug.models import Category

Category.objects.create(name="页面错误")
Category.objects.create(name="数据错误")
Category.objects.create(name="逻辑错误")
Category.objects.create(name="新增数据")
Category.objects.create(name="BUG修复")
Category.objects.create(name="功能开发")
