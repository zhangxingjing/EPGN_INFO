# -*- coding: utf-8 -*-
# Generated by Django 1.11 on 2020-10-20 15:49
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('worktime', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='worktask',
            name='create_time',
            field=models.DateField(verbose_name='创建时间'),
        ),
    ]