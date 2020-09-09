import xadmin
from .models import *


@xadmin.sites.register(LaboratoryTime)
class LaboratoryTimeAdmin(object):
    list_display = ['time']


@xadmin.sites.register(TestContent)
class LaboratoryTestContentAdmin(object):
    list_display = ['name', 'category', 'default_role', 'title', 'time', 'task_manage']


@xadmin.sites.register(Laboratory)
class LaboratoryAdmin(object):
    list_display = ['name', 'manage_user']
    search_fields = ['name', 'manage_user']


@xadmin.sites.register(WorkTime)
class WorkTimeAdmin(object):
    list_display = ['task_user', 'create_time', 'car_model', 'car_number', 'vin', 'task_title', 'task_content',
                    'check_task', 'check_data', 'check_report']
