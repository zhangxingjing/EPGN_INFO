from django.db import models


class Description(models.Model):
    name = models.CharField(max_length=50, verbose_name='抱怨描述')

    class Meta:
        ordering = ['id']
        db_table = 'tb_audio_description'
        verbose_name_plural = verbose_name = '抱怨描述'


class Frequency(models.Model):
    name = models.CharField(max_length=50, verbose_name='频率范围')

    class Meta:
        ordering = ['id']
        db_table = 'tb_audio_frequency'
        verbose_name_plural = verbose_name = '频率'


class Status(models.Model):
    name = models.CharField(max_length=255, verbose_name='工况')

    class Meta:
        ordering = ['id']
        db_table = 'tb_audio_status'
        verbose_name_plural = verbose_name = '抱怨工况'


class Audio(models.Model):
    description = models.ForeignKey(Description, null=True, blank=True, default=None, verbose_name="抱怨描述")
    status = models.CharField(max_length=255, verbose_name="抱怨工况")
    frequency = models.CharField(default=None, null=True, max_length=25, verbose_name="频率")
    details = models.CharField(max_length=255, verbose_name='抱怨详细描述')
    detail_from = models.CharField(max_length=255, verbose_name="抱怨来源")
    complaint_feature = models.CharField(max_length=255, verbose_name="抱怨特征")
    order = models.CharField(default=None, null=True, max_length=25, verbose_name='阶次')  # 阶次
    reason = models.CharField(max_length=255, verbose_name='关键零件或因素')
    measures = models.CharField(max_length=255, verbose_name='措施')

    car_model = models.CharField(max_length=255, verbose_name='车型')
    propulsion = models.CharField(max_length=255, verbose_name='发动机')
    gearbox = models.CharField(max_length=255, verbose_name="变速箱")
    power = models.CharField(max_length=255, verbose_name='功率')
    tire_model = models.CharField(max_length=255, verbose_name='轮胎型号')
    author = models.CharField(max_length=25, verbose_name='上传人')

    raw_mp3 = models.CharField(max_length=255, default=None, null=True, verbose_name='报告原始数据')
    img = models.CharField(max_length=255, default=None, null=True, verbose_name='抱怨特征图')
    complain_mp3 = models.CharField(max_length=255, default=None, null=True, verbose_name='抱怨音频')
    ppt = models.CharField(max_length=255, default=None, null=True, verbose_name='分析报告')

    class Meta:
        ordering = ['-id']
        db_table = 'tb_audio'
        verbose_name_plural = verbose_name = '抱怨音频'
