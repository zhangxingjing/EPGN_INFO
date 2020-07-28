# -*- coding: utf-8 -*-
# Generated by Django 1.11.23 on 2020-07-27 15:43
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
                ('details', models.CharField(max_length=25, verbose_name='抱怨详细描述')),
                ('detail_from', models.CharField(max_length=255, verbose_name='抱怨来源')),
                ('complaint_feature', models.CharField(max_length=40, verbose_name='抱怨特征')),
                ('order', models.IntegerField(null=True, verbose_name='阶次')),
                ('reason', models.CharField(max_length=25, verbose_name='关键零件或因素')),
                ('measures', models.CharField(max_length=25, verbose_name='措施')),
                ('car_model', models.CharField(max_length=25, verbose_name='车型')),
                ('propulsion', models.CharField(max_length=25, verbose_name='发动机')),
                ('gearbox', models.CharField(max_length=40, verbose_name='变速箱')),
                ('power', models.CharField(max_length=25, verbose_name='功率')),
                ('tire_model', models.CharField(max_length=25, verbose_name='轮胎型号')),
                ('author', models.CharField(max_length=25, verbose_name='上传人')),
                ('raw_mp3', models.CharField(max_length=100, verbose_name='报告原始数据')),
                ('img', models.CharField(max_length=100, verbose_name='抱怨特征图')),
                ('complain_mp3', models.CharField(max_length=100, verbose_name='抱怨音频')),
                ('ppt', models.CharField(max_length=100, verbose_name='分析报告')),
            ],
            options={
                'verbose_name': '抱怨音频',
                'verbose_name_plural': '抱怨音频',
                'db_table': 'tb_audio',
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='Description',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='抱怨描述')),
            ],
            options={
                'verbose_name': '抱怨描述',
                'verbose_name_plural': '抱怨描述',
                'db_table': 'tb_audio_description',
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='Frequency',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='频率范围')),
            ],
            options={
                'verbose_name': '频率',
                'verbose_name_plural': '频率',
                'db_table': 'tb_audio_frequency',
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='Status',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='工况')),
            ],
            options={
                'verbose_name': '抱怨工况',
                'verbose_name_plural': '抱怨工况',
                'db_table': 'tb_audio_status',
                'ordering': ['id'],
            },
        ),
        migrations.AddField(
            model_name='audio',
            name='description',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='audio.Description', verbose_name='抱怨描述'),
        ),
        migrations.AddField(
            model_name='audio',
            name='frequency',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='audio.Frequency', verbose_name='频率'),
        ),
        migrations.AddField(
            model_name='audio',
            name='status',
            field=models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='audio.Status', verbose_name='抱怨工况'),
        ),
    ]
