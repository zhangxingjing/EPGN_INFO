# !/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2020/5/6 下午1:08
# @Author  : Zheng Xingtao
# @File    : __init__.py
import pymysql

pymysql.version_info = (1, 3, 13, "final", 0)
pymysql.install_as_MySQLdb()
