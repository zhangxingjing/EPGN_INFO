from django.db import models


# Create your models here.

class Audio(models.Model):
    description = models.CharField(max_length=25, verbose_name='简单描述')
    car_model = models.CharField(max_length=25, verbose_name='车型')
    propulsion = models.CharField(max_length=25, verbose_name='动力总成')
    power = models.CharField(max_length=25, verbose_name='功率')
    gearbox = models.CharField(max_length=40, verbose_name="变速箱")
    complaint_feature = models.CharField(max_length=40, verbose_name="抱怨特征")
    status = models.CharField(max_length=128, verbose_name='工况')
    author = models.CharField(max_length=25, verbose_name='上传人')
    frequency = models.IntegerField(null=True, verbose_name='频率')  # Hz
    order = models.IntegerField(null=True, verbose_name='阶次')  # 阶
    tire_model = models.CharField(max_length=25, verbose_name='轮胎型号')
    measures = models.CharField(max_length=25, verbose_name='措施')
    reason = models.CharField(max_length=25, verbose_name='关键零件或因素')
    details = models.CharField(max_length=25, verbose_name='抱怨详细描述')
    raw_mp3 = models.CharField(max_length=100, verbose_name='报告原始数据')
    img = models.CharField(max_length=100, verbose_name='抱怨特征图')
    complain_mp3 = models.CharField(max_length=100, verbose_name='抱怨音频')
    ppt = models.CharField(max_length=100, verbose_name='分析报告')

    class Meta:
        ordering = ['-id']
        db_table = 'tb_audio'
        verbose_name_plural = verbose_name = '抱怨音频'


class AudioStatus(models.Model):
    name = models.CharField(max_length=50, verbose_name='工况')

    class Meta:
        ordering = ['-id']
        db_table = 'tb_audio_status'
        verbose_name_plural = verbose_name = '抱怨工况'
