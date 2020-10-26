from django.db import models


class Description(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, verbose_name='抱怨描述')

    class Meta:
        ordering = ['id']
        db_table = 'tb_audio_description'
        verbose_name_plural = verbose_name = '抱怨描述'

    def __str__(self):
        return self.name


class Frequency(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, verbose_name='频率范围')

    class Meta:
        ordering = ['id']
        db_table = 'tb_audio_frequency'
        verbose_name_plural = verbose_name = '频率'

    def __str__(self):
        return self.name

class Status(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255, verbose_name='工况')

    class Meta:
        ordering = ['id']
        db_table = 'tb_audio_status'
        verbose_name_plural = verbose_name = '抱怨工况'

    def __str__(self):
        return self.name

class Audio(models.Model):
    """
    按照需求，这里所有的数据都可以为空，当获取的数据中为None时，也发布购入
    """
    id = models.AutoField(primary_key=True)
    description = models.ForeignKey(Description, verbose_name="抱怨描述", null=True, blank=True, default=None)
    details = models.CharField(verbose_name='抱怨详细描述', max_length=255, null=True, blank=True, default=None)
    detail_from = models.CharField(verbose_name="抱怨来源", max_length=255, null=True, blank=True, default=None)

    # 多对多的关系表
    frequency = models.CharField(verbose_name="频率", max_length=25, null=True, blank=True)  # 频率
    order = models.CharField(verbose_name='阶次', max_length=25, default=None, null=True, blank=True)  # 阶次

    # 默认反向应用的名称是：(当前类名称小写)_set,可以用related_name来指定
    frequency_range = models.ManyToManyField(
        Frequency,
        db_table='tb_audio_and_frequency',
        related_name="frequency_range",
        verbose_name="频率范围",
    )

    status = models.CharField(verbose_name="抱怨工况", max_length=255, null=True, blank=True, default=None)
    reason = models.CharField(verbose_name='关键零件或因素', max_length=255, null=True, blank=True)
    measures = models.CharField(verbose_name='措施', max_length=255, null=True, blank=True)

    car_model = models.CharField(verbose_name='车型', max_length=255, null=True, blank=True, default=None)
    propulsion = models.CharField(verbose_name='发动机', max_length=255, null=True, blank=True, default=None)
    gearbox = models.CharField(verbose_name="变速箱", max_length=255, null=True, blank=True, default=None)
    power = models.CharField(verbose_name='功率', max_length=255, null=True, blank=True, default=None)
    tire_model = models.CharField(verbose_name='轮胎型号', max_length=255, null=True, blank=True, default=None)
    author = models.CharField(verbose_name='上传人', max_length=25, null=True, blank=True, default=None)

    hdf = models.CharField(verbose_name='报告原始数据', max_length=255, null=True, blank=True, default=None)
    img = models.CharField(verbose_name='抱怨特征图', max_length=255, null=True, blank=True, default=None)
    mp3 = models.CharField(verbose_name='抱怨音频', max_length=255, null=True, blank=True, default=None)
    ppt = models.CharField(verbose_name='分析报告', max_length=255, null=True, blank=True, default=None)

    class Meta:
        ordering = ['-id']
        db_table = 'tb_audio'
        verbose_name_plural = verbose_name = '抱怨音频'

    @property
    def description_name(self):
        return self.description.name
