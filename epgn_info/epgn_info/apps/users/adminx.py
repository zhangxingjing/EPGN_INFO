import xadmin
from django.forms import Textarea

from .models import User, UserTask
from django.contrib import admin


# 用户的站点管理
# @xadmin.site.register(User)
class UserAdmin():
    list_display = ['id', 'username', "job_number", 'last_login', 'is_staff', 'is_superuser', 'update_files_data', 'download_files_data', 'task']  # 这里显示的是修改数据之后后台可以看到的页面中的数据
    fields = ("username", "job_number", 'password', 'is_superuser', 'task')  # 这是用户添加数据的时候可以看到的页面
    list_display_links = ['username', 'job_number', ]  # 用来配置哪些字段可以作为链接, 点击他们可以进入编辑页面
    search_fields = ['username', 'job_number']

    # save_on_top = True  # 保存, 编辑, 编辑并新建的 按钮 是否在顶部展示
    # actions_on_top = True   # 动作相关配置, 是否展示在顶部
    # actions_on_bottom = True    # 动作相关配置, 是否展示在底部

    # def save_models(self, request, obj, form, change):
    #     obj.owner = request.user
    #     # 把当前登录的用户赋值给obj.owner ==> 如果未登录通过request.user拿到匿名用户对象
    #     return super(UserAdmin, self).save_models(request, obj, form, change)  # change用来保存当前数据是新增的还是更新的
    #     return super().save_models()

    def post_count(self, obj):
        return obj.post_set.count()

    post_count.short_description = "用户信息"


class UserTaskAdmin():
    list_display = ['id', 'user', 'task', ]
    fields = ('user', 'task', )
    list_display_links = ['task']
    search_fields = ['user', ]

    class Meta:
        widgets = {
            'task_info': Textarea(attrs={
                'style': 'height: 200px;width:500px'}),
        }

    # def save_models(self, request, obj, form, change):
    #     obj.owner = request.user
    #     return super().save_models()

    def post_count(self, obj):
        return obj.post_set.count()

    post_count.short_description = "任务信息"

# class UserTaskInline(admin.StackedInline):
#     model = UserTask
#
#
# class UserAdmin(admin.ModelAdmin):
#     inlines = [UserTaskInline, ]

xadmin.site.unregister(User)
xadmin.site.register(User, UserAdmin)

xadmin.site.register(UserTask, UserTaskAdmin)
