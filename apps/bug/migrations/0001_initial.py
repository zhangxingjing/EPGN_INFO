# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2020-09-08 10:20
from __future__ import unicode_literals

from django.db import migrations, models
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Bug',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('content', models.TextField(blank=True, null=True, verbose_name='Bug信息')),
                ('status', models.SmallIntegerField(choices=[(0, '未处理'), (1, '处理中'), (2, '已处理')], default=0, verbose_name='Bug状态')),
                ('level', models.SmallIntegerField(choices=[(0, '一级'), (1, '二级'), (2, '三级'), (3, '四级')], default=3, verbose_name='Bug级别')),
                ('create_time', models.DateField(default=django.utils.timezone.now, verbose_name='提交时间')),
            ],
            options={
                'verbose_name': '错误信息',
                'verbose_name_plural': '错误信息',
                'db_table': 'tb_bug',
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=25, verbose_name='类别')),
            ],
            options={
                'verbose_name': '错误分类',
                'db_table': 'tb_bug_category',
                'verbose_name_plural': '错误分类',
            },
        ),
        migrations.CreateModel(
            name='Developer',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.SmallIntegerField(choices=[(1, '郑兴涛'), (2, '吴斌')], default=1, verbose_name='处理者')),
            ],
            options={
                'verbose_name': '处理人员',
                'db_table': 'tb_bug_developer',
                'verbose_name_plural': '处理人员',
            },
        ),
    ]