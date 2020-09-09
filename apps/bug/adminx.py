import xadmin
from .models import *


@xadmin.sites.register(Category)
class CategoryAdmin():
    list_display = ['id', 'name']
    search_fields = ['name', ]
    list_display_links = ['name', ]


@xadmin.sites.register(Developer)
class DeveloperAdmin():
    list_display = ['id', 'name']
    search_fields = ['name', ]
    list_display_links = ['name', ]


@xadmin.sites.register(Bug)
class BugAdmin():
    list_display = ["id", "author", "level", "category", "developer", "content", "status"]
    search_fields = ["author", "category", "content", "status"]
    list_display_links = ["status"]

# from django.contrib import admin
# admin.site.register(Category)
# admin.site.register(Developer)
# admin.site.register(Bug)