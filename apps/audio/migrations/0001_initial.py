# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2020-09-03 14:38
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Audio',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('details', models.CharField(blank=True, default=None, max_length=255, null=True, verbose_name='抱怨详细描述')),
                ('detail_from', models.CharField(blank=True, default=None, max_length=255, null=True, verbose_name='抱怨来源')),
                ('frequency', models.CharField(blank=True, max_length=25, null=True, verbose_name='频率')),
                ('order', models.CharField(blank=True, default=None, max_length=25, null=True, verbose_name='阶次')),
                ('status', models.CharField(blank=True, default=None, max_length=255, null=True, verbose_name='抱怨工况')),
                ('reason', models.CharField(blank=True, max_length=255, null=True, verbose_name='关键零件或因素')),
                ('measures', models.CharField(blank=True, max_length=255, null=True, verbose_name='措施')),
                ('car_model', models.CharField(blank=True, default=None, max_length=255, null=True, verbose_name='车型')),
                ('propulsion', models.CharField(blank=True, default=None, max_length=255, null=True, verbose_name='发动机')),
                ('gearbox', models.CharField(blank=True, default=None, max_length=255, null=True, verbose_name='变速箱')),
                ('power', models.CharField(blank=True, default=None, max_length=255, null=True, verbose_name='功率')),
                ('tire_model', models.CharField(blank=True, default=None, max_length=255, null=True, verbose_name='轮胎型号')),
                ('author', models.CharField(blank=True, default=None, max_length=25, null=True, verbose_name='上传人')),
                ('hdf', models.CharField(blank=True, default=None, max_length=255, null=True, verbose_name='报告原始数据')),
                ('img', models.CharField(blank=True, default=None, max_length=255, null=True, verbose_name='抱怨特征图')),
                ('mp3', models.CharField(blank=True, default=None, max_length=255, null=True, verbose_name='抱怨音频')),
                ('ppt', models.CharField(blank=True, default=None, max_length=255, null=True, verbose_name='分析报告')),
            ],
            options={
                'verbose_name_plural': '抱怨音频',
                'verbose_name': '抱怨音频',
                'ordering': ['-id'],
                'db_table': 'tb_audio',
            },
        ),
        migrations.CreateModel(
            name='Description',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='抱怨描述')),
            ],
            options={
                'verbose_name_plural': '抱怨描述',
                'verbose_name': '抱怨描述',
                'ordering': ['id'],
                'db_table': 'tb_audio_description',
            },
        ),
        migrations.CreateModel(
            name='Frequency',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='频率范围')),
            ],
            options={
                'verbose_name_plural': '频率',
                'verbose_name': '频率',
                'ordering': ['id'],
                'db_table': 'tb_audio_frequency',
            },
        ),
        migrations.CreateModel(
            name='Status',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, verbose_name='工况')),
            ],
            options={
                'verbose_name_plural': '抱怨工况',
                'verbose_name': '抱怨工况',
                'ordering': ['id'],
                'db_table': 'tb_audio_status',
            },
        ),
        migrations.AddField(
            model_name='audio',
            name='description',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='audio.Description', verbose_name='抱怨描述'),
        ),
        migrations.AddField(
            model_name='audio',
            name='frequency_range',
            field=models.ManyToManyField(db_table='tb_audio_and_frequency', related_name='frequency_range', to='audio.Frequency', verbose_name='频率范围'),
        ),
    ]
