import re
from .models import User
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
            user = User.objects.get(username=account)  # 帐号为手机号
        else:
            user = User.objects.get(nickname=account)  # 帐号为用户名
    except User.DoesNotExist:
        return None
    else:
        return user


# 自定义用户名工号认证
class UsernameMobileAuthBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        # 在这里使用上面自定义的获取用户信息方法, 拿到用户后校验jwt
        user = get_user_by_account(username)
        # print("用户在这里开始校验", user, user.nickname)
        if user is not None and user.check_password(password):
            print("用户校验成功")
            return user


# 自定义jwt认证成功返回的数据 ==> 用户登录成功返回的数据
def jwt_response_payload_handler(token, user=None, request=None):
    # 用户登录成功, 后台向session中存储数据
    return {
        'token': token,
        'user_id': user.id,
        'username': user.username,
        "nickname": user.nickname,
    }


# 后台创建用户的时候用户的密码明文显示 ==> 校验密码错误
@receiver(post_save, sender=User)  # post_save:接收信号的方式，在save后, sender: 接收信号的model
def create_user(sender, instance=None, created=False, **kwargs):
    # 是否新建，因为update的时候也会进行post_save
    if created:
        password = instance.password  # instance相当于user
        instance.set_password(password)
        instance.save()
