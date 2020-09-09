from django.db import models
from users.models import User
from fileinfo.models import Platform
from settings.dev import ROLE_CHOICE, CHECK_WORK_INFO, TEST_CATEGORY


class LaboratoryTime(models.Model):
    """试验工时模型"""
    id = models.AutoField(primary_key=True)
    time = models.FloatField(null=True, blank=True, default=None, max_length=25, verbose_name="工时")

    class Meta:
        ordering = ('id',)
        db_table = 'tb_time_datetime'
        verbose_name_plural = verbose_name = '试验室工时'

    def __str__(self):
        return str(self.time)


class Laboratory(models.Model):
    """实验室模型"""
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, verbose_name="试验室")
    manage_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='manage',
        verbose_name="试验室负责人"
    )

    class Meta:
        ordering = ('id',)
        db_table = 'tb_time_laboratory'
        verbose_name_plural = verbose_name = '试验室信息'

    def __str__(self):
        return self.name


class TestContent(models.Model):
    """试验内容模型"""
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, verbose_name="试验内容")
    category = models.SmallIntegerField(default=1, choices=TEST_CATEGORY, verbose_name="分类")
    default_role = models.SmallIntegerField(default=1, choices=ROLE_CHOICE, verbose_name="角色")
    title = models.ForeignKey(
        Laboratory,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='test_title',
        verbose_name="试验室名称"
    )
    time = models.ForeignKey(
        LaboratoryTime,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        default=None,
        related_name='test_time',
        verbose_name="试验员工时"
    )
    task_manage = models.ManyToManyField(
        User,
        db_table='tb_time_and_user',
        related_name="task_manage",
        verbose_name="信息审批人",
    )

    class Meta:
        ordering = ('id',)
        db_table = 'tb_time_content'
        verbose_name_plural = verbose_name = '试验内容'

    def __str__(self):
        return self.name


class WorkTime(models.Model):
    """工时模型"""
    id = models.AutoField(primary_key=True)
    task_user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='task_user',
        verbose_name="试验员"
    )
    create_time = models.DateTimeField(auto_now_add=True, verbose_name="创建时间")  # 这里使用用户提交的时间

    car_model = models.ForeignKey(
        Platform,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='car_model',
        verbose_name="车型"
    )
    car_number = models.CharField(max_length=50, verbose_name="车号")
    vin = models.CharField(max_length=50, verbose_name="Vin码")
    task_title = models.CharField(max_length=255, verbose_name="任务名称")
    task_content = models.ForeignKey(
        TestContent,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        default=None,
        related_name='worktime_content',
        verbose_name="任务详细内容"
    )

    check_task = models.SmallIntegerField(default=1, choices=CHECK_WORK_INFO, verbose_name="确认任务内容")
    check_data = models.BooleanField(default=False, verbose_name="确认数据上传")
    check_report = models.BooleanField(default=False, verbose_name="确认报告状况")

    class Meta:
        ordering = ('id',)
        db_table = 'tb_time'
        verbose_name_plural = verbose_name = '工时信息'

    def __str__(self):
        return self.task_content.name