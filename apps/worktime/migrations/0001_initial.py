# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2020-10-14 15:44
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('users', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('fileinfo', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Laboratory',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=255, verbose_name='试验室')),
                ('manager', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='room_manager', to=settings.AUTH_USER_MODEL, verbose_name='试验室负责人')),
            ],
            options={
                'verbose_name': '试验室信息',
                'db_table': 'tb_time_laboratory',
                'verbose_name_plural': '试验室信息',
                'ordering': ('id',),
            },
        ),
        migrations.CreateModel(
            name='TaskDetail',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('hour', models.CharField(max_length=50, verbose_name='工时')),
                ('name', models.CharField(max_length=50, verbose_name='试验详细分类')),
                ('color', models.BooleanField(default=False, verbose_name='确认工时修改')),
                ('role', models.SmallIntegerField(choices=[(1, 'R'), (2, 'S'), (3, 'M')], default=1, verbose_name='角色')),
                ('detail', models.CharField(blank=True, max_length=50, null=True, verbose_name='试验详细内容')),
                ('category', models.SmallIntegerField(choices=[(1, '测试'), (2, '管理')], default=1, verbose_name='项目类别')),
                ('laboratory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='laboratory', to='worktime.Laboratory', verbose_name='试验室')),
            ],
            options={
                'verbose_name': '试验内容',
                'db_table': 'tb_time_content',
                'verbose_name_plural': '试验内容',
                'ordering': ('-id',),
            },
        ),
        migrations.CreateModel(
            name='WorkTask',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('vin', models.CharField(max_length=50, verbose_name='Vin码')),
                ('hours', models.CharField(max_length=50, verbose_name='总工时')),
                ('task_title', models.CharField(max_length=255, verbose_name='任务名称')),
                ('create_time', models.DateField(auto_now_add=True, verbose_name='创建时间')),
                ('check_data', models.BooleanField(default=False, verbose_name='确认数据上传')),
                ('check_report', models.BooleanField(default=False, verbose_name='确认报告状况')),
                ('car_number', models.CharField(blank=True, max_length=50, null=True, verbose_name='车号')),
                ('check_task', models.SmallIntegerField(choices=[(1, '未审核'), (2, '已通过'), (3, '未通过')], default=1, verbose_name='确认任务内容')),
                ('car_model', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='car_model', to='fileinfo.Platform', verbose_name='车型')),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='task', to='users.Task', verbose_name='工时任务')),
                ('task_manager', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='task_manager', to=settings.AUTH_USER_MODEL, verbose_name='管理员')),
                ('task_user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tester', to=settings.AUTH_USER_MODEL, verbose_name='试验员')),
            ],
            options={
                'verbose_name': '工时信息',
                'db_table': 'tb_time',
                'verbose_name_plural': '工时信息',
                'ordering': ('id',),
            },
        ),
        migrations.AddField(
            model_name='taskdetail',
            name='parent',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='work_task', to='worktime.WorkTask', verbose_name='工时任务'),
        ),
        migrations.AddField(
            model_name='taskdetail',
            name='task_manager',
            field=models.ManyToManyField(db_table='tb_time_and_user', related_name='mes_manager', to=settings.AUTH_USER_MODEL, verbose_name='信息审批人'),
        ),
    ]
