from django.db import models


# single piece of data information
class Fileinfo(models.Model):
    platform = models.CharField(max_length=25, verbose_name="平台")
    carmodel = models.CharField(max_length=25, verbose_name='车型')
    produce = models.CharField(max_length=25, verbose_name='生产阶段')
    direction = models.CharField(max_length=25, verbose_name='专业方向')
    parts = models.CharField(max_length=25, verbose_name='零部件')
    status = models.CharField(max_length=128, verbose_name='工况')
    author = models.CharField(max_length=25, verbose_name='试验员')
    car_num = models.CharField(max_length=25, verbose_name='车号')
    propulsion = models.CharField(max_length=25, verbose_name='动力总成')
    power = models.CharField(max_length=25, verbose_name='功率')
    create_date = models.CharField(max_length=40, verbose_name='试验时间')
    file_name = models.CharField(max_length=255, verbose_name='文件名')
    file_type = models.CharField(max_length=40, verbose_name="文件类型")
    other_need = models.CharField(max_length=40, verbose_name="其他需求")
    gearbox = models.CharField(max_length=40, verbose_name="变速箱信息")

    # what properties can be added to determine if the current file is experimental or reporting

    class Meta:
        ordering = ['-id']
        db_table = 'tb_car'  # corresponding data table name
        verbose_name_plural = verbose_name = '汽车数据信息'


# powertrain - power
class PropulsionPower(models.Model):
    num = models.CharField(max_length=20, verbose_name='功率')
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, related_name='subs', null=True, blank=True,
                               verbose_name='动力总成')

    class Meta:
        db_table = 'tb_power'
        verbose_name = verbose_name_plural = '动力总成-功率'

    def __str__(self):
        return self.num


# plotform - model
class Platform(models.Model):
    name = models.CharField(max_length=20, verbose_name='车型')
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, related_name='subs', null=True, blank=True, verbose_name='平台')

    class Meta:
        db_table = 'tb_platform'
        verbose_name = verbose_name_plural = '平台-车型'

    def __str__(self):
        return self.name


# professional direction - parts - working conditions
class Direction(models.Model):
    name = models.CharField(max_length=50, verbose_name='工况')
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, related_name='subs', null=True, blank=True, verbose_name='专业方向')

    class Meta:
        db_table = 'tb_direction'
        verbose_name = verbose_name_plural = '专业方向-工况'

    def __str__(self):
        return self.name


# gearbox
class GearBox(models.Model):
    name = models.CharField(max_length=40, verbose_name="变速箱")

    class Meta:
        db_table = 'tb_gearbox'  # corresponding data table name
        verbose_name_plural = verbose_name = '变速箱信息'


# channel
class Channel(models.Model):
    name = models.CharField(max_length=50, verbose_name='其他写法')
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, related_name='subs', null=True, blank=True, verbose_name='通道')

    class Meta:
        db_table = 'tb_channel'
        verbose_name = verbose_name_plural = '通道-其他写法'

    def __str__(self):
        return self.name
