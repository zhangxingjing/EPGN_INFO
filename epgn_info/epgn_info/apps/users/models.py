from django.db import models
from django.contrib.auth.models import AbstractUser


class User(AbstractUser):
    """自定义用户模型类，在配置文件中配置告诉Django使用自定义的模型类"""
    id = models.AutoField(primary_key=True)  # 设置id为主键，自增
    job_number = models.CharField(max_length=22, unique=True, verbose_name='工号')  # 用户注册时候的工号
    views = models.IntegerField('访问量', default=0)  # 用户访问量
    update_files_data = models.IntegerField('数据上传', default=0)
    download_files_data = models.IntegerField('数据下载', default=0)
    task= models.IntegerField("待办事项",  default=0)

    # 近期上传的数据信息展示 ==> 从数据表中查询当前用户近期的数据
    class Meta:
        '对应的数据表名字'
        db_table = 'tb_user'
        verbose_name_plural = verbose_name = '用户信息'

    def __str__(self):
        return self.username


class UserTask(models.Model):
    """用户待完成任务"""
    id = models.AutoField(primary_key=True)  # 设置id为主键，自增
    task = models.CharField(max_length=225, null=False, verbose_name='任务信息')
    user = models.ForeignKey(User, on_delete=models.CASCADE)

    class Meta:
        ordering = ('id',)
        db_table = 'tb_task'
        verbose_name_plural = verbose_name = '任务信息'

    def num(self, obj):
        return obj.User.task

    def __str__(self):
        return self.task
