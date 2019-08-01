from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """自定义用户模型类"""
    """在配置文件中配置告诉Django使用自定义的模型类"""
    mobile = models.CharField(max_length=11, unique=True, verbose_name='手机号')  # 自定义用户模型类添加的字段
    jobnumber = models.CharField(max_length=22, unique=True, verbose_name='工号')  # 用户注册时候的工号

    class Meta:
        '对应的数据表名字'
        db_table = 'tb_user'
        verbose_name_plural = verbose_name = '用户信息'
