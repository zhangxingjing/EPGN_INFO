# !/usr/bin/env python
# -*- coding: utf-8 -*-
# @Time    : 2020/4/29 下午12:57
# @Author  : Zheng Xingtao
# @File    : devp.py


from .dev import *

DEBUG = False

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'HOST': '127.0.0.1',  # 数据库主机
        'PORT': 3306,  # 数据库端口
        'USER': 'root',  # 数据库用户名
        'PASSWORD': 'root',  # 数据库用户密码
        'NAME': 'EPGN_INFO',  # 43新建数据库==> 使用xadmin
        'OPTIONS': {
            'read_default_file': os.path.dirname(os.path.abspath(__file__)) + '/my.cnf',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_AUTO_CREATE_USER'",
        },
    }
}


HAYSTACK_CONNECTIONS = {
    'default': {
        'INDEX_NAME': 'epgn',
        'URL': 'http://172.26.209.199:9200/',
        'ENGINE': 'haystack.backends.elasticsearch_backend.ElasticsearchSearchEngine',
        "PATH": os.path.join(BASE_DIR, 'whoosh'),
    },
}

FILE_HEAD_PATH = "/media/sf_Y_DRIVE/Database/H_HDF/"    # 文件上传的路径
FILE_READ_PATH = "/media/sf_Y_DRIVE/Database/R_HDF/"    # 可读HDF文件路径
AUDIO_FILE_PATH = "/media/sf_Y_DRIVE/Database/Audio/"   # 抱怨音频文件

