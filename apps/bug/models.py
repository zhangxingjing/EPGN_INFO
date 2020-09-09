from django.db import models
from users.models import User
from django.utils import timezone
from settings.dev import DEVELOPER_CHOICE


class Category(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=25, verbose_name="类别")

    class Meta:
        db_table = 'tb_bug_category'
        verbose_name = verbose_name_plural = '错误分类'

    def __str__(self):
        return self.name


class Developer(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.SmallIntegerField(choices=DEVELOPER_CHOICE, default=1, verbose_name="处理者")

    class Meta:
        db_table = "tb_bug_developer"
        verbose_name = verbose_name_plural = '处理人员'

    def __str__(self):
        return self.name


class Bug(models.Model):
    id = models.AutoField(primary_key=True)
    author = models.ForeignKey(User, null=True, blank=True, default=None, verbose_name="提交者")
    category = models.ForeignKey(Category, null=True, blank=True, default=None, verbose_name="Bug类别")
    developer = models.ForeignKey(Developer, null=True, blank=True, default=None, verbose_name="DeBug人员")
    content = models.TextField(blank=True, null=True, verbose_name="Bug信息")
    status = models.SmallIntegerField(choices=((0, "未处理"), (1, "处理中"), (2, "已处理")), default=0, verbose_name="Bug状态")
    level = models.SmallIntegerField(choices=((0, "一级"), (1, "二级"), (2, "三级"), (3, "四级")), default=3, verbose_name="Bug级别")
    create_time = models.DateField(default=timezone.now, verbose_name="提交时间")

    class Meta:
        ordering = ['-id']
        db_table = 'tb_bug'
        verbose_name = verbose_name_plural = '错误信息'
