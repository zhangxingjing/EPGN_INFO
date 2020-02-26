from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """自定义用户模型类，在配置文件中配置告诉Django使用自定义的模型类"""
    job_number = models.CharField(max_length=22, unique=True, verbose_name='工号')  # 用户注册时候的工号
    views = models.IntegerField('访问量', default=0)  # 用户访问量
    update_files_data = models.IntegerField('数据上传', default=0)
    download_files_data = models.IntegerField('数据下载', default=0)
    task_data = models.IntegerField('未完成任务', default=0)

    # 近期上传的数据信息展示 ==> 从数据表中查询当前用户近期的数据
    class Meta:
        '对应的数据表名字'
        db_table = 'tb_user'
        verbose_name_plural = verbose_name = '用户信息'

    def __str__(self):
        return self.username


class UserTask(models.Model):
    """用户待完成任务"""
    # username = models.ForeignKey(User, verbose_name='用户名')
    # username = models.ForeignKey(User, to_field='username', verbose_name='用户名')
    task_info = models.CharField(max_length=225, verbose_name='任务信息')
    username = models.ForeignKey(User, on_delete=models.CASCADE, null=False, blank=False, verbose_name='用户名')

    class Meta:
        db_table = 'tb_task'
        verbose_name_plural = verbose_name = '任务信息'

    def __str__(self):
        return self.task_info
