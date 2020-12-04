from django.contrib import admin

from voice.models import Source, Status, Voice, FileSave


# Register your models here.
class SourceAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'name'
    ]
    search_fields = [
        'name',
    ]
    list_display_links = [
        'name',
    ]


class StatusAdmin(admin.ModelAdmin):
    list_display = [
        'id',
        'name',
    ]
    search_fields = [
        'name',
    ]
    list_display_links = [
        'name',
    ]


class FileSaveAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "path"
    ]


class VoiceAdmin(admin.ModelAdmin):
    list_display = [
        "id",
        "author",
        "car_model",
        "propulsion",
        "gearbox",
        "power",
        "status",
        "source",
        "depict",
        "remark",
        # "hdf",
        # "img",
        # "mp3"
        # "file",
    ]


admin.site.register(Source, SourceAdmin)
admin.site.register(Status, StatusAdmin)
admin.site.register(FileSave, FileSaveAdmin)
admin.site.register(Voice, VoiceAdmin)
