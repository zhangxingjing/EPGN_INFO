# -*- coding: utf-8 -*-
# Generated by Django 1.11.23 on 2020-06-02 09:55
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.CharField(max_length=25, verbose_name='简单描述')),
                ('car_model', models.CharField(max_length=25, verbose_name='车型')),
                ('propulsion', models.CharField(max_length=25, verbose_name='动力总成')),
                ('power', models.CharField(max_length=25, verbose_name='功率')),
                ('gearbox', models.CharField(max_length=40, verbose_name='变速箱')),
                ('complaint_feature', models.CharField(max_length=40, verbose_name='抱怨特征')),
                ('status', models.CharField(max_length=128, verbose_name='工况')),
                ('author', models.CharField(max_length=25, verbose_name='上传人')),
                ('frequency', models.IntegerField(null=True, verbose_name='频率')),
                ('order', models.IntegerField(null=True, verbose_name='阶次')),
                ('tire_model', models.CharField(max_length=25, verbose_name='轮胎型号')),
                ('measures', models.CharField(max_length=25, verbose_name='措施')),
                ('reason', models.CharField(max_length=25, verbose_name='关键零件或因素')),
                ('details', models.CharField(max_length=25, verbose_name='抱怨详细描述')),
                ('raw_mp3', models.CharField(max_length=100, verbose_name='报告原始数据')),
                ('img', models.CharField(max_length=100, verbose_name='抱怨特征图')),
                ('complain_mp3', models.CharField(max_length=100, verbose_name='抱怨音频')),
                ('ppt', models.CharField(max_length=100, verbose_name='分析报告')),
            ],
            options={
                'ordering': ['-id'],
                'db_table': 'tb_audio',
                'verbose_name': '抱怨音频',
                'verbose_name_plural': '抱怨音频',
            },
        ),
        migrations.CreateModel(
            name='AudioStatus',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='工况')),
            ],
            options={
                'ordering': ['-id'],
                'db_table': 'tb_audio_status',
                'verbose_name': '抱怨工况',
                'verbose_name_plural': '抱怨工况',
            },
        ),
    ]
