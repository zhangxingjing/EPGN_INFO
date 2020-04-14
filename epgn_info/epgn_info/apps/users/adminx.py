import xadmin
from django.forms import Textarea
from django.shortcuts import reverse
from .models import User, Task, Section, Direction


# 用户的站点管理
# @xadmin.site.register(User)
class UserAdmin():
    def post_count(self, obj):
        return obj.task.count()

    post_count.short_description = "待办事项"

    list_display = ('id', 'username', "job_number", 'last_login', 'update_files_data', 'views', 'download_files_data',
                    'post_count', 'section', 'direction', 'phone',)  # 这里显示的是修改数据之后后台可以看到的页面中的数据
    fields = ("username", "job_number", 'password', 'section', 'direction', 'phone', 'task',
              'is_superuser',)  # 这是用户添加数据的时候可以看到的页面
    list_display_links = ('username', 'job_number',)  # 用来配置哪些字段可以作为链接, 点击他们可以进入编辑页面
    search_fields = ('username', 'job_number', 'phone', 'section', 'direction',)

    # 右下角显示保存相关的按钮
    # save_on_top = True  # 保存, 编辑, 编辑并新建的 按钮 是否在顶部展示
    # actions_on_top = True   # 动作相关配置, 是否展示在顶部
    # actions_on_bottom = True    # 动作相关配置, 是否展示在底部

    # def save_models(self, request, obj, form, change):
    #     obj.owner = request.user
    #     # 把当前登录的用户赋值给obj.owner ==> 如果未登录通过request.user拿到匿名用户对象
    #     return super(UserAdmin, self).save_models(request, obj, form, change)  # change用来保存当前数据是新增的还是更新的
    #     return super().save_models()


# 任务信息
class TaskAdmin():
    list_display = ('id', 'name',)


# 部门信息
class SectionAdmin():
    list_display = ('id', 'name',)


# 方向信息
class DirectionAdmin():
    list_display = ('id', 'name',)


xadmin.site.unregister(User)
xadmin.site.register(User, UserAdmin)
xadmin.site.register(Task, TaskAdmin)
xadmin.site.register(Section, SectionAdmin)
xadmin.site.register(Direction, DirectionAdmin)
