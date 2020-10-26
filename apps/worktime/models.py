from django.db import models

from fileinfo.models import Platform
from settings.dev import ROLE_CHOICE, CHECK_WORK_INFO, TEST_CATEGORY
from users.models import User, Task


class Laboratory(models.Model):
    """实验室模型"""
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, verbose_name="试验室")
    manager = models.ForeignKey(
        User,
        null=True,
        blank=True,
        related_name='room_manager',
        on_delete=models.CASCADE,
        verbose_name="试验室负责人"
    )

    class Meta:
        ordering = ('id',)
        db_table = 'tb_time_laboratory'
        verbose_name_plural = verbose_name = '试验室信息'

    def __str__(self):
        return self.name


class WorkTask(models.Model):
    """工时模型"""
    id = models.AutoField(primary_key=True)
    vin = models.CharField(max_length=50, verbose_name="Vin码")
    hours = models.CharField(max_length=50, verbose_name="总工时")
    task_title = models.CharField(max_length=255, verbose_name="任务名称")
    create_time = models.DateField(verbose_name="创建时间")
    check_data = models.BooleanField(default=False, verbose_name="确认数据上传")
    check_report = models.BooleanField(default=False, verbose_name="确认报告状况")
    car_number = models.CharField(max_length=50, null=True, blank=True, verbose_name="车号")
    check_task = models.SmallIntegerField(default=1, choices=CHECK_WORK_INFO, verbose_name="确认任务内容")

    task_manager = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='task_manager',
        verbose_name="管理员"
    )

    task_user = models.ForeignKey(
        User,
        verbose_name="试验员",
        related_name='tester',
        on_delete=models.CASCADE
    )

    car_model = models.ForeignKey(
        Platform,
        null=True,
        verbose_name="车型",
        related_name='car_model',
        on_delete=models.SET_NULL
    )

    task = models.ForeignKey(
        Task,
        null=True,
        blank=True,
        related_name="task",
        verbose_name="工时任务",
        # on_delete=models.CASCADE    # 级联删除
        on_delete=models.SET_NULL
    )

    class Meta:
        ordering = ('id',)
        db_table = 'tb_time'
        verbose_name_plural = verbose_name = '工时信息'

    def __str__(self):
        return self.task_title


class TaskDetail(models.Model):
    """试验内容模型"""
    id = models.AutoField(primary_key=True)
    hour = models.CharField(max_length=50, verbose_name="工时")
    name = models.CharField(max_length=50, verbose_name="试验详细分类")
    color = models.BooleanField(default=False, verbose_name="确认工时修改")
    role = models.SmallIntegerField(default=1, choices=ROLE_CHOICE, verbose_name="角色")
    detail = models.CharField(max_length=50, null=True, blank=True, verbose_name="试验详细内容")
    category = models.SmallIntegerField(default=1, choices=TEST_CATEGORY, verbose_name="项目类别")
    laboratory = models.ForeignKey(
        Laboratory,
        verbose_name="试验室",
        related_name='laboratory',
        on_delete=models.CASCADE
    )

    parent = models.ForeignKey(
        WorkTask,
        null=True,
        blank=True,
        verbose_name="工时任务",
        related_name='work_task',
        on_delete=models.CASCADE
    )

    task_manager = models.ManyToManyField(
        User,
        verbose_name="信息审批人",
        related_name="mes_manager",
        db_table='tb_time_and_user',
    )

    class Meta:
        ordering = ('-id',)
        db_table = 'tb_time_content'
        verbose_name_plural = verbose_name = '试验内容'

    def __str__(self):
        return self.name
