from django.contrib.auth.backends import ModelBackend
# 导入自己的用户类
from .models import User


class MyBackend(ModelBackend):
    # 复写authenticate
    def authenticate(self, request, username=None, password=None, **kwargs):
        # 思路  1.先找用户 2.在做验证密码

        # 找人
        user = None
        try:
            user = User.objects.get(username=username)
        except:
            try:
                user = User.objects.get(phone=username)
            except:
                return None
        # 做密码验证
        if user.check_password(password):
            return user
        else:
            return None