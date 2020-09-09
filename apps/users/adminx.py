import xadmin
from .models import User, Task, Section


# 用户的站点管理
class UserAdmin():
    def post_count(self, obj):
        return obj.task.count()

    post_count.short_description = "待办事项"
    list_display = ('id', 'username', "job_number", 'last_login', 'update_files_data', 'views', 'download_files_data',
                    'post_count', 'section', 'phone',)  # 这里显示的是修改数据之后后台可以看到的页面中的数据
    fields = ("username", "job_number", 'password', 'section', 'phone', 'task',
              'is_superuser',)  # 这是用户添加数据的时候可以看到的页面
    list_display_links = ('username', 'job_number',)  # 用来配置哪些字段可以作为链接, 点击他们可以进入编辑页面
    search_fields = ('username', 'job_number', 'phone', 'section',)


# 任务信息
class TaskAdmin():
    list_display = ('id', 'name',)


# 部门信息
class SectionAdmin():
    list_display = ('id', 'name', 'direction')


xadmin.site.unregister(User)
xadmin.site.register(User, UserAdmin)
xadmin.site.register(Task, TaskAdmin)
xadmin.site.register(Section, SectionAdmin)
