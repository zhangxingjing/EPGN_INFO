import re
import datetime

from django.http import JsonResponse
from rest_framework.response import Response

from .models import User, Task
from worktime.models import Laboratory
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.contrib.auth.backends import ModelBackend


# 用户名或者工号登录
def get_user_by_account(account):
    """
    根据帐号获取user对象
    :param account: 账号，可以是用户名，也可以是手机号
    :return: User对象 或者 None
    """
    try:
        if re.match(r'(\d+|\w+\d+)', account):
            user = User.objects.get(job_number=account)  # 帐号为工号
        else:
            user = User.objects.get(username=account)  # 帐号为用户名
    except User.DoesNotExist:
        return None
    else:
        return user


# 自定义用户名工号认证
class UsernameMobileAuthBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        # 在这里使用上面自定义的获取用户信息方法, 拿到用户后校验jwt
        user = get_user_by_account(username)
        if user is not None and user.check_password(password):
            return user


# 自定义jwt认证成功返回的数据 ==> 用户登录成功返回的数据
def jwt_response_payload_handler(token, user=None, request=None):
    # 在这里修改用户登录后的配置信息
    user.is_staff = True  # 修改用户登录状态
    user.last_login = str(datetime.datetime.today())  # 修改用户最后登录时间
    user.save()

    # 用户查看工时系统
    try:
        # Laboratory.objects.get(manage_user__id=user.id)
        Laboratory.objects.get(manager__id=user.id)
        worktime = True
    except:
        worktime = False

    user_info = {
        'id': user.id,
        'token': token,
        'username': user.username,
        "job_number": user.job_number,
        "worktime": worktime
    }
    return user_info


# 后台创建用户的时候用户的密码明文显示 ==> 校验密码错误
@receiver(post_save, sender=User)  # post_save:接收信号的方式，在save后, sender: 接收信号的model
def create_user(sender, instance=None, created=False, **kwargs):
    # 是否新建，因为update的时候也会进行post_save
    if created:
        password = instance.password  # instance相当于user
        instance.set_password(password)
        instance.save()
