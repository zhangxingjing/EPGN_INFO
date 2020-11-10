from django.db import models
from django.contrib.auth.models import AbstractUser


# 任务信息
class Task(models.Model):
    id = models.AutoField(primary_key=True)  # 设置id为主键，自增
    name = models.CharField(max_length=225, null=False, verbose_name='任务信息')

    class Meta:
        ordering = ('id',)
        db_table = 'tb_user_task'
        verbose_name_plural = verbose_name = '任务信息'

    def __str__(self):
        return self.name


# 部门信息
class Section(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=225, verbose_name="部门信息")
    direction = models.CharField(max_length=225, null=True, blank=True, default=None, verbose_name="专业方向")

    class Meta:
        db_table = "tb_user_section"
        verbose_name_plural = verbose_name = '部门信息'

    def __str__(self):
        return self.name


# 用户
class User(AbstractUser):
    """自定义用户模型类，在配置文件中配置告诉Django使用自定义的模型类"""
    id = models.AutoField(primary_key=True)
    phone = models.CharField(max_length=11, verbose_name="电话")
    views = models.SmallIntegerField(default=0, verbose_name='访问量')
    update_files_data = models.SmallIntegerField(default=0, verbose_name='数据上传')
    download_files_data = models.SmallIntegerField(default=0, verbose_name='数据下载')
    job_number = models.CharField(max_length=22, unique=True, verbose_name='工号')
    section = models.ForeignKey(Section, on_delete=models.CASCADE, null=True, blank=True, default=None, verbose_name='部门信息')
    task = models.ManyToManyField(
        Task, blank=True, default=None, verbose_name='待办事项',
        db_table='tb_user_and_task',
        related_name="tag_article"
    )

    # 近期上传的数据信息展示 ==> 从数据表中查询当前用户近期的数据
    class Meta:
        '对应的数据表名字'
        ordering = ('id',)
        db_table = 'tb_user'
        verbose_name_plural = verbose_name = '用户信息'

    def __str__(self):
        return self.username


# 周任务
class WeenSum(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name="用户")
    total = models.IntegerField(verbose_name="周上传量")

    class Meta:
        '对应的数据表名字'
        ordering = ('id',)
        db_table = 'tb_user_week'
        verbose_name_plural = verbose_name = '用户信息'

    def __str__(self):
        return self.user
