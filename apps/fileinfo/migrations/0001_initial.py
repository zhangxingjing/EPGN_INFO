# Generated by Django 2.2 on 2020-12-07 14:07

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Fileinfo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('platform', models.CharField(max_length=25, verbose_name='平台')),
                ('carmodel', models.CharField(max_length=25, verbose_name='车型')),
                ('produce', models.CharField(max_length=25, verbose_name='生产阶段')),
                ('direction', models.CharField(max_length=25, verbose_name='专业方向')),
                ('parts', models.CharField(max_length=25, verbose_name='零部件')),
                ('status', models.CharField(max_length=128, verbose_name='工况')),
                ('author', models.CharField(max_length=25, verbose_name='试验员')),
                ('car_num', models.CharField(max_length=25, verbose_name='车号')),
                ('propulsion', models.CharField(max_length=25, verbose_name='动力总成')),
                ('power', models.CharField(max_length=25, verbose_name='功率')),
                ('create_date', models.CharField(max_length=40, verbose_name='试验时间')),
                ('file_name', models.CharField(max_length=255, verbose_name='文件名')),
                ('file_type', models.CharField(max_length=40, verbose_name='文件类型')),
                ('other_need', models.CharField(max_length=40, verbose_name='其他需求')),
                ('gearbox', models.CharField(default='None', max_length=40, verbose_name='变速箱信息')),
                ('file_status', models.CharField(default='否', max_length=50, verbose_name='文件状态')),
            ],
            options={
                'verbose_name': '汽车数据信息',
                'verbose_name_plural': '汽车数据信息',
                'db_table': 'tb_car',
                'ordering': ['-id'],
            },
        ),
        migrations.CreateModel(
            name='GearBox',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=40, verbose_name='变速箱')),
            ],
            options={
                'verbose_name': '变速箱信息',
                'verbose_name_plural': '变速箱信息',
                'db_table': 'tb_car_gearbox',
            },
        ),
        migrations.CreateModel(
            name='PropulsionPower',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('num', models.CharField(max_length=20, verbose_name='功率')),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='subs', to='fileinfo.PropulsionPower', verbose_name='动力总成')),
            ],
            options={
                'verbose_name': '动力总成-功率',
                'verbose_name_plural': '动力总成-功率',
                'db_table': 'tb_car_power',
            },
        ),
        migrations.CreateModel(
            name='Platform',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20, verbose_name='车型')),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='subs', to='fileinfo.Platform', verbose_name='平台')),
            ],
            options={
                'verbose_name': '平台-车型',
                'verbose_name_plural': '平台-车型',
                'db_table': 'tb_car_platform',
            },
        ),
        migrations.CreateModel(
            name='Direction',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='工况')),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='subs', to='fileinfo.Direction', verbose_name='专业方向')),
            ],
            options={
                'verbose_name': '专业方向-工况',
                'verbose_name_plural': '专业方向-工况',
                'db_table': 'tb_car_direction',
            },
        ),
        migrations.CreateModel(
            name='Channel',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=50, verbose_name='其他写法')),
                ('parent', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='subs', to='fileinfo.Channel', verbose_name='通道')),
            ],
            options={
                'verbose_name': '通道-其他写法',
                'verbose_name_plural': '通道-其他写法',
                'db_table': 'tb_car_channel',
            },
        ),
    ]
