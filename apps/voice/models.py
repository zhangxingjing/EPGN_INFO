from django.db import models

from fileinfo.models import Platform, PropulsionPower, GearBox
from users.models import User


# Create your models here.
class Source(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64, null=True, blank=True, default=None, verbose_name="声源")

    class Meta:
        ordering = ['-id']
        db_table = 'tb_voice_source'
        verbose_name_plural = verbose_name = "声源"

    def __str__(self):
        return self.name


class Status(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=64, null=True, blank=True, default=None, verbose_name="工况")

    class Meta:
        ordering = ['-id']
        db_table = 'tb_voice_status'
        verbose_name_plural = verbose_name = "工况"

    def __str__(self):
        return self.name


"""
class FileSave(models.Model):
    '''借鉴腾讯云的桶存储, 在这里保存当前文件的绝对路径, 每次获取文件对象之后，通过获取对象属性，获取它的文件信息'''
    # db_index = True ：普通索引； unique = True： 唯一索引；
    id = models.AutoField(primary_key=True, unique=True)
    path = models.CharField(max_length=255, verbose_name="文件")

    class Meta:
        ordering = ['-id']
        db_table = 'tb_voice_file'
        verbose_name_plural = verbose_name = '文件'

    def __str__(self):
        return self.path
"""


class Voice(models.Model):
    id = models.AutoField(primary_key=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, default=None, verbose_name="上传人")
    car_model = models.ForeignKey(Platform, on_delete=models.CASCADE, null=True, blank=True, default=None, verbose_name="车型")
    propulsion = models.ForeignKey(PropulsionPower, on_delete=models.CASCADE, related_name="propulsion", verbose_name='发动机', max_length=255, null=True, blank=True, default=None)
    gearbox = models.ForeignKey(GearBox, on_delete=models.CASCADE, verbose_name="变速箱", max_length=255, null=True, blank=True, default=None)
    power = models.ForeignKey(PropulsionPower, on_delete=models.CASCADE, related_name="power", verbose_name='功率', max_length=255, null=True, blank=True, default=None)
    status = models.CharField(max_length=255, null=True, blank=True, default=None, verbose_name='工况')
    source = models.CharField(max_length=255, null=True, blank=True, default=None, verbose_name='声源')
    depict = models.CharField(max_length=255, null=True, blank=True, default=None, verbose_name="描述")
    remark = models.CharField(max_length=255, null=True, blank=True, default=None, verbose_name="备注")
    hdf = models.CharField(max_length=255, null=True, blank=True, default=None, verbose_name='原始数据')
    img_1 = models.CharField(max_length=255, null=True, blank=True, default=None, verbose_name='特征图')
    img_2 = models.CharField(max_length=255, null=True, blank=True, default=None, verbose_name='特征图')
    mp3 = models.CharField(max_length=255, null=True, blank=True, default=None, verbose_name='音频')


    class Meta:
        ordering = ['-id']
        db_table = 'tb_voice'
        verbose_name_plural = verbose_name = '音频'

    def __str__(self):
        return self.car_model.name + "-" + self.source
