from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """自定义用户模型类，在配置文件中配置告诉Django使用自定义的模型类"""
    job_number = models.CharField(max_length=22, unique=True, verbose_name='工号')  # 用户注册时候的工号
    views = models.IntegerField('访问量', default=0)  # 用户访问量

    class Meta:
        '对应的数据表名字'
        db_table = 'tb_user'
        verbose_name_plural = verbose_name = '用户信息'
