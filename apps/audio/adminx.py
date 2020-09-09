import xadmin
from .models import *


@xadmin.sites.register(Description)
class DescriptionAdmin():
    list_display = ['id', 'name']
    search_fields = ['name', ]
    list_display_links = ['name', ]


@xadmin.sites.register(Frequency)
class FrequencyAdmin():
    list_display = ['id', 'name']
    search_fields = ['name', ]
    list_display_links = ['name', ]


@xadmin.sites.register(Status)
class StatusAdmin():
    list_display = ['id', 'name']
    search_fields = ['name', ]
    list_display_links = ['name', ]


@xadmin.sites.register(Audio)
class AudioAdmin():
    list_display = ['id', 'description', 'frequency', 'status', 'details', 'detail_from', 'order',
                    'reason', 'measures', 'car_model', 'propulsion', 'gearbox', 'power', 'tire_model',
                    'author', 'mp3', 'img', 'mp3', 'ppt']
    search_fields = ['name', ]
    list_display_links = ['name', ]
