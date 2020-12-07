# Generated by Django 2.2 on 2020-12-07 14:07

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('fileinfo', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='FileSave',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False, unique=True)),
                ('path', models.CharField(max_length=255, verbose_name='文件')),
            ],
            options={
                'verbose_name': '文件',
                'verbose_name_plural': '文件',
                'db_table': 'tb_voice_file',
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='Source',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, default=None, max_length=64, null=True, verbose_name='声源')),
            ],
            options={
                'verbose_name': '声源',
                'verbose_name_plural': '声源',
                'db_table': 'tb_voice_source',
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='Status',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(blank=True, default=None, max_length=64, null=True, verbose_name='工况')),
            ],
            options={
                'verbose_name': '工况',
                'verbose_name_plural': '工况',
                'db_table': 'tb_voice_status',
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='Voice',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('status', models.CharField(blank=True, default=None, max_length=255, null=True, verbose_name='工况')),
                ('source', models.CharField(blank=True, default=None, max_length=255, null=True, verbose_name='声源')),
                ('depict', models.CharField(blank=True, default=None, max_length=255, null=True, verbose_name='描述')),
                ('remark', models.CharField(blank=True, default=None, max_length=255, null=True, verbose_name='备注')),
                ('author', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='上传人')),
                ('car_model', models.ForeignKey(blank=True, default=None, null=True, on_delete=django.db.models.deletion.CASCADE, to='fileinfo.Platform', verbose_name='车型')),
                ('file', models.ManyToManyField(db_table='tb_voice_and_file', related_name='voice_file', to='voice.FileSave', verbose_name='文件存储')),
                ('gearbox', models.ForeignKey(blank=True, default=None, max_length=255, null=True, on_delete=django.db.models.deletion.CASCADE, to='fileinfo.GearBox', verbose_name='变速箱')),
                ('power', models.ForeignKey(blank=True, default=None, max_length=255, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='power', to='fileinfo.PropulsionPower', verbose_name='功率')),
                ('propulsion', models.ForeignKey(blank=True, default=None, max_length=255, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='propulsion', to='fileinfo.PropulsionPower', verbose_name='发动机')),
            ],
            options={
                'verbose_name': '音频',
                'verbose_name_plural': '音频',
                'db_table': 'tb_voice',
                'ordering': ['-id'],
            },
        ),
    ]
