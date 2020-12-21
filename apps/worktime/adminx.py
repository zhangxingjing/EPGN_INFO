import xadmin
from .models import *


@xadmin.sites.register(Laboratory)
class LaboratoryAdmin(object):
    list_display = [
        "id",
        "name",
        "manager"
    ]
    search_fields = [
        'name',
        'manager'
    ]
    list_display_links = [
        'name'
    ]


@xadmin.sites.register(WorkTask)
class WorkTimeAdmin(object):
    list_display = [
        "vin",
        "hours",
        "car_number",
        "task_title",
        "create_time",
        "task_manager",
        "task_user",
        "car_model",
        "check_data",
        "check_report",
        "check_task",
    ]


@xadmin.sites.register(TaskDetail)
class DetailInfoAdmin(object):
    list_display = [
        "hour",
        "name",
        "color",
        "role",
        "detail",
        "category",
        "laboratory",
        "parent",
        "task_manager"
    ]
