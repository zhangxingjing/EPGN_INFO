# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : insert_user.py
# Datetime : 2020/9/7 下午1:16

from insert_base import *
from users.models import User
from worktime.models import Laboratory, TaskDetail

# 线上用户
# manage_id_list_all = [8, 12, 20, 2, 26, 31, 35, 39, 41, 42, 44, 45, 4]

# manage_id_list_all = [4, 6, 13, 14, 17, 20, 24, 28, 31, 35, 36, 37, 38, 39]
manage_id_list_all = [
    "杨怡",
    "高超",
    "石建策",
    "胡冬枚",
    "费标求",
    "韩国华",
    "吴春军",
    "杨飞",
    "黄立新",
    "赵野",
    "束元",
    "陈远",
    "李献",
    "官明超"
]

# 四驱转鼓试验室
try:
    content = TaskDetail(hour="1", name="车辆准备（上转鼓）", color=False, role=1, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="0.5", name="车辆准备（不上转鼓）", color=False, role=1, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="1", name="测试准备", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="1", name="怠速测试", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", name="轮胎噪声认可", color=False, role=1, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", name="内部噪声", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", name="附件整车测试准备", color=False, role=3, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", name="附件噪声测试", color=False, role=3, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="", name="其他", color=False, role=1, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="", name="轮胎管理", color=False, role=1, detail="", category=2, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in ["吴春军"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="", name="准备间管理", color=False, role=1, detail="", category=2, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in ["吴春军"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="", name="转鼓维护", color=False, role=1, detail="", category=2, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in ["吴春军"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("四驱转鼓试验室: ", e)

# 材料试验室
try:
    content = TaskDetail(hour="2", name="阻尼损耗因子测试样件准备", color=False, role=3, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in ["杨飞"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="0.5", name="阻尼损耗因子标准测试", color=False, role=3, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in ["杨飞"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="1", name="阻尼损耗因子测试数据分析", color=False, role=1, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in ["杨飞"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", name="驻波管测试样件准备", color=False, role=3, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in ["杨飞"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", name="驻波管标准测试", color=False, role=3, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in ["杨飞"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="1", name="驻波管测试数据分析", color=False, role=1, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in ["杨飞"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="1", name="Alpha箱测试样件准备", color=False, role=3, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in ["杨飞"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="1", name="Alpha箱标准测试", color=False, role=3, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in ["杨飞"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="0.5", name="Alpha箱测试数据分析", color=False, role=1, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in ["杨飞"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="1", name="Alphamat测试样件准备", color=False, role=3, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in ["杨飞"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="1", name="Alphamat标准测试", color=False, role=3, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in ["杨飞"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="0", name="Alphamat测试数据分析", color=False, role=1, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in ["杨飞"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="1", name="流阻测试样件准备", color=False, role=3, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in ["杨飞"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="1", name="流阻标准测试", color=False, role=3, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in ["杨飞"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="0.5", name="流阻测试数据分析", color=False, role=1, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in ["杨飞"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="", name="其他", color=False, role=1, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in ["杨飞"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="", name="备件管理", color=False, role=3, detail="", category=2, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in ["杨飞"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="", name="特殊车辆样件制作", color=False, role=3, detail="", category=2, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in ["杨飞"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("材料试验室: ", e)

# 动刚度试验
try:
    content = TaskDetail(hour="6", name="白车身动刚度试验准备", color=False, role=1, detail="", category=1, laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="6", name="白车身动刚度测试", color=False, role=1, detail="", category=1, laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="4", name="白车身动刚度实验数据分析", color=False, role=1, detail="", category=1, laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="3", name="舒适刚度测试", color=False, role=1, detail="", category=1, laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="1", category=1, name="舒适刚度试验数分析", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="8", category=1, name="装饰车身动刚度试验准备", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="8", category=1, name="装饰车身动刚度测试", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="4", category=1, name="装饰合身动刚度实验数据分析", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="3", category=1, name="仪表板认可", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", category=1, name="转向管柱", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="4", category=1, name="局部动刚度测试", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", category=1, name="后视镜固有频率", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="", category=1, name="其他", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="", category=2, name="其他", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in ["高超"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("动刚度试验: ", e)

# 车身隔声试验
try:
    content = TaskDetail(hour="8", category=1, name="整车隔声测试", color=False, role=3, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in ["杨飞", "韩国华"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", category=1, name="HVAC认可台架准备", color=False, role=3, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in ["杨飞", "韩国华"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", category=1, name="HVAC认可测试", color=False, role=3, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in ["杨飞", "韩国华"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", category=1, name="附件整车测试准备", color=False, role=3, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in ["杨飞", "韩国华"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", category=1, name="附件整车测试", color=False, role=3, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in ["杨飞", "韩国华"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", category=1, name="附件台架准备", color=False, role=3, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in ["杨飞", "韩国华"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", category=1, name="附件台架测试", color=False, role=3, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in ["杨飞", "韩国华"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="", category=1, name="其他", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("车身隔声试验: ", e)

# 动力总成试验室
try:
    content = TaskDetail(hour="24", category=1, name="内燃机台架安装及调试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in ["石建策", "胡冬枚"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="24", category=1, name="内燃机台架测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in ["石建策", "胡冬枚"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="8", category=1, name="内燃机台架测试", color=False, role=3, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in ["石建策", "胡冬枚"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="8", category=1, name="电机台架安装及调试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in ["石建策", "胡冬枚"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="12", category=1, name="电机台架测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in ["石建策", "胡冬枚"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="8", category=1, name="电机台架拆卸", color=False, role=3, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in ["石建策", "胡冬枚"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="", category=1, name="其他", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in ["石建策", "胡冬枚"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="", category=1, name="动力总成零件管理", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("动力总成试验室: ", e)

# 前驱转鼓试验室
try:
    content = TaskDetail(hour="0.5", category=1, name="车辆准备（不上转鼓）", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="1", category=1, name="测试准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", category=1, name="怠速测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", category=1, name="附件整车测试准备", color=False, role=3, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", category=1, name="附件噪声测试", color=False, role=3, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="", category=1, name="其他", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="", category=2, name="仓库管理", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in ["赵野"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="", category=2, name="转鼓维护", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in ["赵野"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("前驱转鼓试验室: ", e)

# 整车测试平台
try:
    content = TaskDetail(hour="0.5", category=1, name="车辆准备", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="1", category=1, name="测试准备（标准）", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", category=1, name="测试准备 （特殊）", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="2", category=1, name="内部噪声", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="1", category=1, name="滚动噪声", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="1", category=1, name="怠速舒适性", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="1", category=1, name="Pass by", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="1", category=1, name="C-ECAP", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="", category=1, name="其他", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="", category=2, name="测试设备维护/标定", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in ["孙赫"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(hour="", category=2, name="数据上传", color=False, role=1, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in ["孙赫"]:
        manage_obj = User.objects.get(username=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("整车测试平台: ", e)
