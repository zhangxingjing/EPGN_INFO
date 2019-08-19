from .models import User
from . import serializers
from django.contrib import auth
from django.http import HttpResponse
from .serializers import AuthUserSerializer
from rest_framework.response import Response
from django.shortcuts import render, redirect
from rest_framework.generics import CreateAPIView
from django.contrib.auth import authenticate, login
from rest_framework import viewsets, mixins, status
from django.contrib.auth.hashers import make_password


# 重写 ==> admin创建的用户密码加密登录校验
class AuthUserView(viewsets.GenericViewSet, mixins.CreateModelMixin, mixins.ListModelMixin):
    serializer_class = AuthUserSerializer
    queryset = User.objects.all()

    def create(self, request, *args, **kwargs):
        serializers = self.get_serializer(data=request.data)
        serializers.is_valid(raise_exception=True)
        serializers.validated_data["password"] = make_password(serializers.validated_data["password"])
        self.perform_create(serializers)
        headers = self.get_success_headers(serializers.data)
        return Response(serializers.data, status=status.HTTP_201_CREATED, headers=headers)


# 创建： url(r'^users/$', views.UserView.as_view()),
class UserView(CreateAPIView):
    serializer_class = serializers.CreateUserSerializer


# 登录: url(r'^login/$', views.user_login)
def user_login(request):
    """用户使用工号，密码登录 ==> 用户登录之后页面跳转到首页 ==> 所有的API需要校验用户登录状态"""
    if request.method == 'GET':
        return render(request, 'login_2.html')
    else:
        username = request.POST.get('username', None)
        password = request.POST.get('password', None)
        print(username, password)
        user = authenticate(username=username, password=password)
        if user:
            login(request, user)  # 用户登录
            return redirect('/base/100')  # 登录成功返回页面
        else:
            return HttpResponse("用户名或者密码错误")


# 退出: url(r'^logout/$', views.logout)
def logout(request):
    auth.logout(request)
    return render(request, 'login_2.html')


# 用户
def user_info(request):
    if request.method == "GET":
        return render(request, 'userinfo.html')
    # 如果是POST请求，接收前端传递的参数，修改用户信息
