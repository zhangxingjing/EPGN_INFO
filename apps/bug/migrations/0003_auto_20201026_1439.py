# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2020-10-26 14:39
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('bug', '0002_auto_20200908_1020'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bug',
            name='developer',
            field=models.SmallIntegerField(choices=[(1, '郑兴涛'), (2, '吴斌')], default=1, verbose_name='DeBug人员'),
        ),
        migrations.DeleteModel(
            name='Developer',
        ),
    ]
