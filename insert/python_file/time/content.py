# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : insert_user.py
# Datetime : 2020/9/7 下午1:16

from insert_base import *
from users.models import User
from worktime.models import Laboratory, TaskDetail

manage_id_list_all = [4, 6, 13, 17, 20, 24, 28, 31, 34, 35, 36, 37, 38]

# 四驱转鼓试验室
try:
    content = TaskDetail(id='1', hour="1", name="车辆准备（上转鼓）", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='2', hour="0.5", name="车辆准备（不上转鼓）", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='3', hour="1", name="测试准备", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='4', hour="2", name="怠速测试", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='5', hour="2", name="轮胎噪声认可", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='6', hour="2", name="内部噪声", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='7', hour="2", name="附件整车测试准备", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='8', hour="2", name="附件噪声测试", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='9', hour="", name="其他", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='10', hour="", name="轮胎管理", color=False, role=2, detail="", category=2, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in [24]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='11', hour="", name="准备间管理", color=False, role=2, detail="", category=2, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in [24]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='12', hour="", name="转鼓维护", color=False, role=2, detail="", category=2, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in [24]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("四驱转鼓试验室: ", e)

# 材料试验室
try:
    content = TaskDetail(id='13', hour="1", name="阻尼损耗因子试验", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()

    for manage_id in [28]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='14', hour="1", name="驻波管试验", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in [28]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='15', hour="1", name="Alpha箱试验", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in [28]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='16', hour="1", name="Alphamat试验", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in [28]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='17', hour="1", name="流阻试验", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in [28]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='18', hour="", name="其他", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in [28]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='19', hour="", name="测试样件准备", color=False, role=2, detail="", category=2, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in [28]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='20', hour="", name="特供件准备", color=False, role=2, detail="", category=2, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in [28]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='21', hour="", name="备件管理", color=False, role=2, detail="", category=2, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in [28]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("材料试验室: ", e)

# 动刚度试验
try:
    content = TaskDetail(id='22', hour="4", name="白车身动刚度试验准备", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='23', hour="8", name="白车身动刚度测试", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='24', hour="4", name="舒适刚度测试", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='25', hour="8", name="装饰车身动刚度试验准备", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='26', hour="8", category=1, name="装饰车身动刚度测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='27', hour="4", category=1, name="局部动刚度测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='28', hour="4", category=1, name="仪表板认可", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='29', hour="6", category=1, name="其他", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("动刚度试验: ", e)

# 车身隔声试验
try:
    content = TaskDetail(id='30', hour="4", category=1, name="整车隔声测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='31', hour="4", category=1, name="HVAC认可台架准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='32', hour="2", category=1, name="HVAC认可测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='33', hour="2", category=1, name="附件整车测试准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='34', hour="2", category=1, name="附件整车测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='35', hour="2", category=1, name="冷却风扇测试台架准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='36', hour="2", category=1, name="车身灵敏度测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='37', hour="4", category=1, name="其他", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("车身隔声试验: ", e)

# 动力总成试验室
try:
    content = TaskDetail(id='38', hour="8", category=1, name="内燃机台架准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [13]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='39', hour="4", category=1, name="内燃机台架测试准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [13]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='40', hour="4", category=1, name="内燃机台架测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [13]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='41', hour="8", category=1, name="混合动力驱动台架准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [13]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='42', hour="4", category=1, name="混合动力驱动测试准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [13]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='43', hour="4", category=1, name="混合动力驱动家测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [13]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='44', hour="8", category=1, name="电机台架准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [13]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='45', hour="4", category=1, name="电机测试准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [13]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='46', hour="4", category=1, name="电机测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [13]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='47', hour="", category=1, name="其他", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [13]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("动力总成试验室: ", e)

# 前驱转鼓试验室
try:
    content = TaskDetail(id='48', hour="0.5", category=1, name="车辆准备（不上转鼓）", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='49', hour="1", category=1, name="测试准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='50', hour="2", category=1, name="怠速测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='51', hour="2", category=1, name="附件整车测试准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='52', hour="2", category=1, name="附件噪声测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='53', hour="", category=1, name="特殊测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in [1]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='54', hour="", category=2, name="仓库管理", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in [34]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='55', hour="", category=2, name="转鼓维护", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in [34]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("前驱转鼓试验室: ", e)

# 整车测试平台
try:
    content = TaskDetail(id='56', hour="0.5", category=2, name="车辆准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='57', hour="1", category=2, name="测试准备（标准）", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='58', hour="2", category=2, name="测试准备 （特殊）", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='59', hour="2", category=2, name="内部噪声", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='60', hour="1", category=2, name="滚动噪声", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='61', hour="1", category=2, name="怠速舒适性", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='62', hour="1", category=2, name="法规噪声（老法规/C-ECAP)", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='63', hour="", category=2, name="其他", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='64', hour="", category=2, name="测试设备维护/标定", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in [3]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='65', hour="", category=2, name="数据上传", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in [3]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("整车测试平台: ", e)

"""
线上用户
manage_id_list_all = [8, 12, 20, 2, 26, 31, 35, 39, 41, 42, 44, 45, 4]

# 四驱转鼓试验室
try:
    content = TaskDetail(id='1', hour="1", name="车辆准备（上转鼓）", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)
        
    content = TaskDetail(id='2', hour="0.5", name="车辆准备（不上转鼓）", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)
        
    content = TaskDetail(id='3', hour="1", name="测试准备", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)
        
    content = TaskDetail(id='4', hour="2", name="怠速测试", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='5', hour="2", name="轮胎噪声认可", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='6', hour="2", name="内部噪声", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='7', hour="2", name="附件整车测试准备", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='8', hour="2", name="附件噪声测试", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='9', hour="", name="其他", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='10', hour="", name="轮胎管理", color=False, role=2, detail="", category=2, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in [31]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='11', hour="", name="准备间管理", color=False, role=2, detail="", category=2, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in [31]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='12', hour="", name="转鼓维护", color=False, role=2, detail="", category=2, laboratory=Laboratory.objects.get(id=1))
    content.save()
    for manage_id in [31]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("四驱转鼓试验室: ", e)

# 材料试验室
try:
    content = TaskDetail(id='13', hour="1", name="阻尼损耗因子试验", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in [35]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='14', hour="1", name="驻波管试验", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in [35]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='15', hour="1", name="Alpha箱试验", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in [35]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='16', hour="1", name="Alphamat试验", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in [35]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='17', hour="1", name="流阻试验", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in [35]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='18', hour="", name="其他", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in [35]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='19', hour="", name="测试样件准备", color=False, role=2, detail="", category=2, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in [35]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='20', hour="", name="特供件准备", color=False, role=2, detail="", category=2, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in [35]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='21', hour="", name="备件管理", color=False, role=2, detail="", category=2, laboratory=Laboratory.objects.get(id=2))
    content.save()
    for manage_id in [35]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("材料试验室: ", e)

# 动刚度试验
try:
    content = TaskDetail(id='22', hour="4", name="白车身动刚度试验准备", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='23', hour="8", name="白车身动刚度测试", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='24', hour="4", name="舒适刚度测试", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='25', hour="8", name="装饰车身动刚度试验准备", color=False, role=2, detail="", category=1, laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='26', hour="8", category=1, name="装饰车身动刚度测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='27', hour="4", category=1, name="局部动刚度测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='28', hour="4", category=1, name="仪表板认可", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='29', hour="6", category=1, name="其他", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=3))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("动刚度试验: ", e)

# 车身隔声试验
try:
    content = TaskDetail(id='30', hour="4", category=1, name="整车隔声测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='31', hour="4", category=1, name="HVAC认可台架准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='32', hour="2", category=1, name="HVAC认可测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='33', hour="2", category=1, name="附件整车测试准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='34', hour="2", category=1, name="附件整车测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='35', hour="2", category=1, name="冷却风扇测试台架准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='36', hour="2", category=1, name="车身灵敏度测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='37', hour="4", category=1, name="其他", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=4))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("车身隔声试验: ", e)

# 动力总成试验室
try:
    content = TaskDetail(id='38', hour="8", category=1, name="内燃机台架准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [20]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='39', hour="4", category=1, name="内燃机台架测试准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [20]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='40', hour="4", category=1, name="内燃机台架测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [20]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='41', hour="8", category=1, name="混合动力驱动台架准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [20]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='42', hour="4", category=1, name="混合动力驱动测试准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [20]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='43', hour="4", category=1, name="混合动力驱动家测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [20]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='44', hour="8", category=1, name="电机台架准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [20]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='45', hour="4", category=1, name="电机测试准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [20]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='46', hour="4", category=1, name="电机测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [20]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='47', hour="", category=1, name="其他", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=5))
    content.save()
    for manage_id in [20]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("动力总成试验室: ", e)

# 前驱转鼓试验室
try:
    content = TaskDetail(id='48', hour="0.5", category=1, name="车辆准备（不上转鼓）", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='49', hour="1", category=1, name="测试准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='50', hour="2", category=1, name="怠速测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='51', hour="2", category=1, name="附件整车测试准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='52', hour="2", category=1, name="附件噪声测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='53', hour="", category=1, name="特殊测试", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='54', hour="", category=2, name="仓库管理", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in [41]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='55', hour="", category=2, name="转鼓维护", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=6))
    content.save()
    for manage_id in [41]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("前驱转鼓试验室: ", e)

# 整车测试平台
try:
    content = TaskDetail(id='56', hour="0.5", category=2, name="车辆准备", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='57', hour="1", category=2, name="测试准备（标准）", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='58', hour="2", category=2, name="测试准备 （特殊）", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='59', hour="2", category=2, name="内部噪声", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='60', hour="1", category=2, name="滚动噪声", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='61', hour="1", category=2, name="怠速舒适性", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='62', hour="1", category=2, name="法规噪声（老法规/C-ECAP)", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='63', hour="", category=2, name="其他", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in manage_id_list_all:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='64', hour="", category=2, name="测试设备维护/标定", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in [7]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)

    content = TaskDetail(id='65', hour="", category=2, name="数据上传", color=False, role=2, detail="", laboratory=Laboratory.objects.get(id=7))
    content.save()
    for manage_id in [7]:
        manage_obj = User.objects.get(id=manage_id)
        content.task_manager.add(manage_obj)
except Exception as e:
    print("整车测试平台: ", e)
"""