# !/usr/bin/env python
# -*- coding: utf-8 -*-
# Author   : Zheng Xingtao
# File     : insert_user.py
# Datetime : 2020/9/7 下午1:16

from insert_base import *
from users.models import User
from worktime.models import TestContent, Laboratory, LaboratoryTime

manage_id_list_all = [40, 43, 39, 42, 44, 20, 16, 23, 28, 32, 8, 5, 36]


########## 四驱转鼓试验室
content = TestContent(
    id='1', category=1, name="车辆准备（上转鼓）", default_role=2,
    title=Laboratory.objects.get(id=1),
    time=LaboratoryTime.objects.get(id=2),
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='2', category=1, name="车辆准备（不上转鼓）", default_role=2,
    title=Laboratory.objects.get(id=1),
    time=LaboratoryTime.objects.get(id=1)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='3', category=1, name="测试准备", default_role=2,
    title=Laboratory.objects.get(id=1),
    time=LaboratoryTime.objects.get(id=2)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='4', category=1, name="怠速测试", default_role=2,
    title=Laboratory.objects.get(id=1),
    time=LaboratoryTime.objects.get(id=4))

content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)



    content.task_manage.add(manage_obj)
content = TestContent(
    id='5', category=1, name="轮胎噪声认可", default_role=2,
    title=Laboratory.objects.get(id=1),
    time=LaboratoryTime.objects.get(id=4)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='6', category=1, name="内部噪声", default_role=2,
    title=Laboratory.objects.get(id=1),
    time=LaboratoryTime.objects.get(id=4)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='7', category=1, name="附件整车测试准备", default_role=2,
    title=Laboratory.objects.get(id=1),
    time=LaboratoryTime.objects.get(id=4)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='8', category=1, name="附件噪声测试", default_role=2,
    title=Laboratory.objects.get(id=1),
    time=LaboratoryTime.objects.get(id=4)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='9', category=1, name="其他", default_role=2,
    title=Laboratory.objects.get(id=1),
    time=None
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='10', category=2, name="轮胎管理", default_role=2,
    title=Laboratory.objects.get(id=1),
    time=None
)
content.save()
for manage_id in [28]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='11', category=2, name="准备间管理", default_role=2,
    title=Laboratory.objects.get(id=1),
    time=None
)
content.save()
for manage_id in [28]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='12', category=2, name="转鼓维护", default_role=2,
    title=Laboratory.objects.get(id=1),
    time=None
)
content.save()
for manage_id in [28]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)


########## 材料试验室
content = TestContent(
    id='13', category=1, name="阻尼损耗因子试验", default_role=2,
    title=Laboratory.objects.get(id=2),
    time=LaboratoryTime.objects.get(id=2)
)
content.save()
for manage_id in [32]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='14', category=1, name="驻波管试验", default_role=2,
    title=Laboratory.objects.get(id=2),
    time=LaboratoryTime.objects.get(id=2)
)
content.save()
for manage_id in [32]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='15', category=1, name="Alpha箱试验", default_role=2,
    title=Laboratory.objects.get(id=2),
    time=LaboratoryTime.objects.get(id=2)
)
content.save()
for manage_id in [32]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='16', category=1, name="Alphamat试验", default_role=2,
    title=Laboratory.objects.get(id=2),
    time=LaboratoryTime.objects.get(id=2)
)
content.save()
for manage_id in [32]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='17', category=1, name="流阻试验", default_role=2,
    title=Laboratory.objects.get(id=2),
    time=LaboratoryTime.objects.get(id=2)
)
content.save()
for manage_id in [32]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='18', category=1, name="其他", default_role=2,
    title=Laboratory.objects.get(id=2),
    time=None
)
content.save()
for manage_id in [32]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='19', category=2, name="测试样件准备", default_role=2,
    title=Laboratory.objects.get(id=2),
    time=None
)
content.save()
for manage_id in [32]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='20', category=2, name="特供件准备", default_role=2,
    title=Laboratory.objects.get(id=2),
    time=None
)
content.save()
for manage_id in [32]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='21', category=2, name="备件管理", default_role=2,
    title=Laboratory.objects.get(id=2),
    time=None
)
content.save()
for manage_id in [32]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



########## 动刚度试验
content = TestContent(
    id='22', category=1, name="白车身动刚度试验准备", default_role=2,
    title=Laboratory.objects.get(id=3),
    time=LaboratoryTime.objects.get(id=4)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='23', category=1, name="白车身动刚度测试", default_role=2,
    title=Laboratory.objects.get(id=3),
    time=LaboratoryTime.objects.get(id=6)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='24', category=1, name="舒适刚度测试", default_role=2,
    title=Laboratory.objects.get(id=4),
    time=LaboratoryTime.objects.get(id=4)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='24', category=1, name="装饰车身动刚度试验准备", default_role=2,
    title=Laboratory.objects.get(id=3),
    time=LaboratoryTime.objects.get(id=6)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='25', category=1, name="装饰车身动刚度测试", default_role=2,
    title=Laboratory.objects.get(id=3),
    time=LaboratoryTime.objects.get(id=6)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='26', category=1, name="局部动刚度测试", default_role=2,
    title=Laboratory.objects.get(id=3),
    time=LaboratoryTime.objects.get(id=4)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='27', category=1, name="仪表板认可", default_role=2,
    title=Laboratory.objects.get(id=3),
    time=LaboratoryTime.objects.get(id=5)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='28', category=1, name="其他", default_role=2,
    title=Laboratory.objects.get(id=3),
    time=None
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)


########## 车身隔声试验
content = TestContent(
    id='29', category=1, name="整车隔声测试", default_role=2,
    title=Laboratory.objects.get(id=4),
    time=LaboratoryTime.objects.get(id=4)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='30', category=1, name="HVAC认可台架准备", default_role=2,
    title=Laboratory.objects.get(id=4),
    time=LaboratoryTime.objects.get(id=4)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='31', category=1, name="HVAC认可测试", default_role=2,
    title=Laboratory.objects.get(id=4),
    time=LaboratoryTime.objects.get(id=3)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='32', category=1, name="附件整车测试准备", default_role=2,
    title=Laboratory.objects.get(id=4),
    time=LaboratoryTime.objects.get(id=3)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='33', category=1, name="附件整车测试", default_role=2,
    title=Laboratory.objects.get(id=4),
    time=LaboratoryTime.objects.get(id=3)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='34', category=1, name="冷却风扇测试台架准备", default_role=2,
    title=Laboratory.objects.get(id=4),
    time=LaboratoryTime.objects.get(id=3)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='35', category=1, name="车身灵敏度测试", default_role=2,
    title=Laboratory.objects.get(id=4),
    time=LaboratoryTime.objects.get(id=4)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='36', category=1, name="其他", default_role=2,
    title=Laboratory.objects.get(id=4),
    time=None
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



########## 动力总成试验室
content = TestContent(
    id='37', category=1, name="内燃机台架准备", default_role=2,
    title=Laboratory.objects.get(id=5),
    time=LaboratoryTime.objects.get(id=6)
)
content.save()
for manage_id in [16]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)




content = TestContent(
    id='38', category=1, name="内燃机台架测试准备", default_role=2,
    title=Laboratory.objects.get(id=5),
    time=LaboratoryTime.objects.get(id=4)
)
content.save()
for manage_id in [16]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='39', category=1, name="内燃机台架测试", default_role=2,
    title=Laboratory.objects.get(id=5),
    time=LaboratoryTime.objects.get(id=4)
)
content.save()
for manage_id in [16]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='40', category=1, name="混合动力驱动台架准备", default_role=2,
    title=Laboratory.objects.get(id=5),
    time=LaboratoryTime.objects.get(id=6)
)
content.save()
for manage_id in [16]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='41', category=1, name="混合动力驱动测试准备", default_role=2,
    title=Laboratory.objects.get(id=5),
    time=LaboratoryTime.objects.get(id=4)
)
content.save()
for manage_id in [16]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='42', category=1, name="混合动力驱动家测试", default_role=2,
    title=Laboratory.objects.get(id=5),
    time=LaboratoryTime.objects.get(id=4)
)
content.save()
for manage_id in [16]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='43', category=1, name="电机台架准备", default_role=2,
    title=Laboratory.objects.get(id=5),
    time=LaboratoryTime.objects.get(id=6)
)
content.save()
for manage_id in [16]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='44', category=1, name="电机测试准备", default_role=2,
    title=Laboratory.objects.get(id=5),
    time=LaboratoryTime.objects.get(id=4)
)
content.save()
for manage_id in [16]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='45', category=1, name="电机测试", default_role=2,
    title=Laboratory.objects.get(id=5),
    time=LaboratoryTime.objects.get(id=4)
)
content.save()
for manage_id in [16]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='46', category=1, name="其他", default_role=2,
    title=Laboratory.objects.get(id=5),
    time=None
)
content.save()
for manage_id in [16]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



########## 前驱转鼓试验室
content = TestContent(
    id='47', category=1, name="车辆准备（不上转鼓）", default_role=2,
    title=Laboratory.objects.get(id=6),
    time=LaboratoryTime.objects.get(id=1)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='48', category=1, name="测试准备", default_role=2,
    title=Laboratory.objects.get(id=6),
    time=LaboratoryTime.objects.get(id=3)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='49', category=1, name="怠速测试", default_role=2,
    title=Laboratory.objects.get(id=6),
    time=LaboratoryTime.objects.get(id=3)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='50', category=1, name="附件整车测试准备", default_role=2,
    title=Laboratory.objects.get(id=6),
    time=LaboratoryTime.objects.get(id=3)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='51', category=1, name="附件噪声测试", default_role=2,
    title=Laboratory.objects.get(id=6),
    time=None
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='52', category=1, name="特殊测试", default_role=2,
    title=Laboratory.objects.get(id=6),
    time=None
)
content.save()
for manage_id in [1]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='53', category=2, name="仓库管理", default_role=2,
    title=Laboratory.objects.get(id=6),
    time=None
)
content.save()
for manage_id in [39]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='54', category=2, name="转鼓维护", default_role=2,
    title=Laboratory.objects.get(id=6),
    time=None
)
content.save()
for manage_id in [39]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



########## 整车测试平台
content = TestContent(
    id='55', category=2, name="车辆准备", default_role=2,
    title=Laboratory.objects.get(id=7),
    time=LaboratoryTime.objects.get(id=1)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='56', category=2, name="测试准备（标准）", default_role=2,
    title=Laboratory.objects.get(id=7),
    time=LaboratoryTime.objects.get(id=2)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='57', category=2, name="测试准备 （特殊）", default_role=2,
    title=Laboratory.objects.get(id=7),
    time=LaboratoryTime.objects.get(id=3)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='58', category=2, name="内部噪声", default_role=2,
    title=Laboratory.objects.get(id=7),
    time=LaboratoryTime.objects.get(id=3)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='59', category=2, name="滚动噪声", default_role=2,
    title=Laboratory.objects.get(id=7),
    time=LaboratoryTime.objects.get(id=2)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='60', category=2, name="怠速舒适性", default_role=2,
    title=Laboratory.objects.get(id=7),
    time=LaboratoryTime.objects.get(id=2)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='61', category=2, name="法规噪声（老法规/C-ECAP)", default_role=2,
    title=Laboratory.objects.get(id=7),
    time=LaboratoryTime.objects.get(id=2)
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='62', category=2, name="其他", default_role=2,
    title=Laboratory.objects.get(id=7),
    time=None
)
content.save()
for manage_id in manage_id_list_all:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='63', category=2, name="测试设备维护/标定", default_role=2,
    title=Laboratory.objects.get(id=7),
    time=None
)
content.save()
for manage_id in [4]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)



content = TestContent(
    id='64', category=2, name="数据上传", default_role=2,
    title=Laboratory.objects.get(id=7),
    time=None
)
content.save()
for manage_id in [4]:
    manage_obj = User.objects.get(id=manage_id)
    content.task_manage.add(manage_obj)

