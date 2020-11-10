from django.contrib import admin

from voice.models import Source, Status, Voice


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
        "hdf",
        "img",
        "mp3"
    ]


admin.site.register(Source, SourceAdmin)
admin.site.register(Voice, VoiceAdmin)
admin.site.register(Status, StatusAdmin)
