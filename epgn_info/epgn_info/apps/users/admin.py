from .models import User
from audioop import reverse
from django.contrib import admin
from django.utils.html import format_html


# 用户的站点管理
@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('id', 'username', 'jobnumber', 'mobile', 'last_login', 'is_superuser')  # 这里显示的是修改数据之后后台可以看到的页面中的数据
    fields = ("username", "jobnumber", "mobile")  # 这是用户添加数据的时候可以看到的页面
    list_display_links = ['username', ]  # 用来配置哪些字段可以作为链接, 点击他们可以进入编辑页面
    search_fields = ['username', 'jobnumber']

    # save_on_top = True  # 保存, 编辑, 编辑并新建的 按钮 是否在顶部展示
    # actions_on_top = True   # 动作相关配置, 是否展示在顶部
    # actions_on_bottom = True    # 动作相关配置, 是否展示在底部

    def save_model(self, request, obj, form, change):
        obj.owner = request.user
        # 把当前登录的用户赋值给obj.owner ==> 如果未登录通过request.user拿到匿名用户对象
        return super(UserAdmin, self).save_model(request, obj, form, change)  # change用来保存当前数据是新增的还是更新的

    def post_count(self, obj):
        return obj.post_set.count()

    post_count.short_description = "用户信息"
