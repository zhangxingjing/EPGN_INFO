from django.db import models


# 单条数据信息
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

    # 可以添加什么属性来确定当前文件是实验数据还是报告数据

    class Meta:
        ordering = ['-id']
        db_table = 'tb_car'  # 对应的数据表名字
        verbose_name_plural = verbose_name = '汽车数据信息'


# 动力总成-功率
class PropulsionPower(models.Model):
    num = models.CharField(max_length=20, verbose_name='功率')
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, related_name='subs', null=True, blank=True,
                               verbose_name='动力总成')

    class Meta:
        db_table = 'tb_power'
        verbose_name = verbose_name_plural = '动力总成-功率'

    def __str__(self):
        return self.num


# 平台-车型
class Platform(models.Model):
    name = models.CharField(max_length=20, verbose_name='车型')
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, related_name='subs', null=True, blank=True,
                               verbose_name='平台')

    class Meta:
        db_table = 'tb_platform'
        verbose_name = verbose_name_plural = '平台-车型'

    def __str__(self):
        return self.name


# 专业方向-零部件-工况
class Direction(models.Model):
    name = models.CharField(max_length=50, verbose_name='工况')
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, related_name='subs', null=True, blank=True,
                               verbose_name='专业方向')

    class Meta:
        db_table = 'tb_direction'
        verbose_name = verbose_name_plural = '专业方向-工况'

    def __str__(self):
        return self.name
